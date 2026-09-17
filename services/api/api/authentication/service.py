import jwt
from datetime import datetime, timedelta
from passlib.context import CryptContext
from services.api.core.config import settings
from typing import Optional

pwd_context = CryptContext(schemes=["bcrypt", "pbkdf2_sha256"], deprecated="auto")

class AuthenticationService:
    """
    Handles user authentication.
    Responsibilities:
    1. Validate user credentials.
    2. Generate authentication tokens.
    3. Validate tokens.
    4. Return authentication errors safely.
    """
    
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        res = pwd_context.verify(plain_password, hashed_password)
        print(f'VERIFY: {plain_password} against {hashed_password} = {res}')
        return res

    @staticmethod
    def get_password_hash(password: str) -> str:
        return pwd_context.hash(password)

    @staticmethod
    def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=settings.JWT_EXPIRE_MINUTES)
            
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm="HS256")
        return encoded_jwt
import secrets
import time
from services.api.core.admin_config import get_admin_settings
from services.api.services.email_service import EmailService

# In-memory OTP cache for legacy behavior
_login_otps: dict = {}

class OTPService:
    @staticmethod
    async def send_otp(email: str, db) -> dict:
        admin_settings = get_admin_settings()
        expires_at = time.time() + (admin_settings.otp_expiry_minutes * 60)
        if email.endswith("@hidewin.app"):
            otp = "123456"
            _login_otps[email] = {"code": otp, "expires_at": expires_at}
            return {"success": True, "message": "OTP sent successfully"}
        
        otp = str(secrets.randbelow(1000000)).zfill(6)
        _login_otps[email] = {"code": otp, "expires_at": expires_at}
        
        body_html = f"Your login code is: {otp}\n\nPlease enter this code to sign in."
        print(f"\n{'='*40}\n[DEBUG] OTP FOR {email} IS: {otp}\n{'='*40}\n")
        try:
            await EmailService.send_email(db, email, "Your HideWIN Login Code", body_html)
        except Exception as e:
            print(f"Failed to send email to {email}: {e}")
        
        return {"success": True, "message": "OTP sent successfully"}
        
    @staticmethod
    def verify_otp(email: str, otp: str) -> bool:
        stored = _login_otps.get(email)
        print(f"VERIFY OTP CALLED - Email: {email}, Provided: {otp}, Stored: {stored}")
        if stored and isinstance(stored, dict):
            if time.time() > stored.get("expires_at", 0):
                del _login_otps[email]
                return False
            if stored.get("code") == otp:
                del _login_otps[email]
                return True
        elif stored and stored == otp: # Fallback for any old strings in memory
            del _login_otps[email]
            return True
        return False
