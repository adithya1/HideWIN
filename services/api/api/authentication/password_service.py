from sqlalchemy.ext.asyncio import AsyncSession
from services.api.api.users.repository import UserRepository
from services.api.api.authentication.service import AuthenticationService
from services.api.services.email_service import EmailService
import secrets

_reset_tokens: dict = {}

class PasswordService:
    @staticmethod
    async def request_password_reset(email: str, db: AsyncSession) -> dict:
        repo = UserRepository(db)
        user = await repo.get_user_by_email(email)
        if user:
            reset_token = secrets.token_urlsafe(32)
            _reset_tokens[reset_token] = email
            reset_link = f"http://localhost:8000/user/reset-password.html?token={reset_token}"
            print(f"\n[HideWIN] Password Reset Link for {email}:\n  {reset_link}\n")
            
            body_html = f"Click here to reset your password: <a href='{reset_link}'>{reset_link}</a>"
            EmailService.send_email(db, email, "HideWIN Password Reset", body_html)
            
        return {"success": True, "message": "If that email is registered, a reset link has been sent."}
        
    @staticmethod
    async def reset_password(token: str, new_password: str, db: AsyncSession) -> dict:
        email = _reset_tokens.get(token)
        if not email:
            raise ValueError("Invalid or expired reset token.")
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
