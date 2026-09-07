from sqlalchemy.ext.asyncio import AsyncSession
from services.api.api.users.repository import UserRepository
from services.api.models.user import User
from services.api.schemas.user_schema import UserUpdate, ChangePasswordRequest
from fastapi import HTTPException
from services.api.api.authentication.service import AuthenticationService

class UserService:
    def __init__(self, repo: UserRepository):
        self.repo = repo

    async def get_user_profile(self, user_id: int) -> dict:
        user = await self.repo.get_user_by_id(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return {
            "id": user.id,
            "email": user.email,
            "is_active": user.is_active,
            "full_name": getattr(user, 'full_name', None),
            # "email_notifications": getattr(user, 'email_notifications', True),
        }

    async def update_my_profile(self, user_id: int, data: UserUpdate, db: AsyncSession) -> dict:
        user = await self.repo.get_user_by_id(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
            
        if data.full_name is not None:
            user.full_name = data.full_name
        if data.email is not None:
            user.email = data.email
            
        await db.commit()
        await db.refresh(user)
        return {"status": "success", "user": {"id": user.id, "email": user.email, "full_name": getattr(user, 'full_name', None)}}
        
    async def change_password(self, user_id: int, data: ChangePasswordRequest, db: AsyncSession) -> dict:
        user = await self.repo.get_user_by_id(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
            
        if not AuthenticationService.verify_password(data.old_password, user.hashed_password):
            raise HTTPException(status_code=400, detail="Incorrect old password")
            
        if len(data.new_password) < 8:
            raise HTTPException(status_code=400, detail="New password must be at least 8 characters")
            
        user.hashed_password = AuthenticationService.get_password_hash(data.new_password)
        await db.commit()
        return {"status": "success", "message": "Password updated successfully"}
        
    async def delete_my_account(self, user_id: int, db: AsyncSession) -> dict:
        user = await self.repo.get_user_by_id(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
            
        # Hard delete for now, mimicking legacy unless soft-delete was implemented
        await db.delete(user)
        await db.commit()
        return {"status": "success", "message": "Account deleted"}
