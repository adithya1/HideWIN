from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from services.api.core.database import get_db
from services.api.core.security import get_current_user
from services.api.models.user import User
from services.api.schemas.user_schema import UserUpdate, ChangePasswordRequest
from services.api.api.users.repository import UserRepository
from services.api.api.users.service import UserService

router = APIRouter(prefix="/user", tags=["user"])

def get_user_service(db: AsyncSession = Depends(get_db)) -> UserService:
    repo = UserRepository(db)
    return UserService(repo)

@router.get("/me")
async def get_my_profile(
    current_user: User = Depends(get_current_user),
    service: UserService = Depends(get_user_service)
):
    return await service.get_user_profile(current_user.id)

@router.put("/me")
async def update_my_profile(
    body: UserUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    service: UserService = Depends(get_user_service)
):
    return await service.update_my_profile(current_user.id, body, db)

@router.post("/change-password")
async def change_password(
    body: ChangePasswordRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    service: UserService = Depends(get_user_service)
):
    return await service.change_password(current_user.id, body, db)

@router.delete("/me")
async def delete_my_account(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    service: UserService = Depends(get_user_service)
):
    return await service.delete_my_account(current_user.id, db)
