from sqlalchemy.ext.asyncio import AsyncSession
from services.api.api.users.repository import UserRepository
from services.api.api.authentication.service import AuthenticationService
from services.api.services.email_service import EmailService
from services.api.core.config import settings
import secrets
import time

_reset_tokens: dict = {}

class PasswordService:
    @staticmethod
    async def request_password_reset(email: str, db: AsyncSession) -> dict:
        repo = UserRepository(db)
        user = await repo.get_user_by_email(email)
        if user:
            reset_token = secrets.token_urlsafe(32)
            _reset_tokens[reset_token] = {"email": email, "expires_at": time.time() + 30 * 60}
            reset_link = f"{settings.WEB_BASE_URL.rstrip('/')}/user/reset-password.html?token={reset_token}"
            
            body_html = f"Click here to reset your password: <a href='{reset_link}'>{reset_link}</a>"
            await EmailService.send_email(db, email, "HideWIN Password Reset", body_html)
            
        return {"success": True, "message": "If that email is registered, a reset link has been sent."}
        
    @staticmethod
    async def reset_password(token: str, new_password: str, db: AsyncSession) -> dict:
        token_record = _reset_tokens.get(token)
        if not token_record or token_record["expires_at"] <= time.time():
            _reset_tokens.pop(token, None)
            raise ValueError("Invalid or expired reset token.")
        email = token_record["email"]
        if len(new_password) < 8:
            raise ValueError("Password must be at least 8 characters.")
            
        repo = UserRepository(db)
        user = await repo.get_user_by_email(email)
        if not user:
            raise ValueError("User not found.")
            
        # Instead of generic user.password, we use hashed_password in the new schema
        user.hashed_password = AuthenticationService.get_password_hash(new_password)
        user.is_active = True
        
        await db.commit()
        del _reset_tokens[token]
        
        return {"success": True, "message": "Password has been successfully reset."}
