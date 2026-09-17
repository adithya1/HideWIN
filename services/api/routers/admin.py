from fastapi import APIRouter, Depends, HTTPException, status, Request
from services.api.core.admin_config import AdminSettings, get_admin_settings, save_admin_settings
from services.api.core.security import get_current_user

router = APIRouter(prefix="/admin", tags=["admin"])

def require_admin(current_user = Depends(get_current_user), admin_settings: AdminSettings = Depends(get_admin_settings)):
    if current_user.email != admin_settings.admin_email:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin privileges required")
    return current_user.email

@router.get("/settings")
async def read_admin_settings(
    admin_email: str = Depends(require_admin),
    settings: AdminSettings = Depends(get_admin_settings)
):
    return {"settings": settings.dict()}

@router.post("/settings")
async def update_admin_settings(
    request: Request,
    admin_email: str = Depends(require_admin),
    settings: AdminSettings = Depends(get_admin_settings)
):
    data = await request.json()
    settings_dict = settings.dict()
    for k, v in data.items():
        if k in settings_dict:
            settings_dict[k] = v
    new_settings = AdminSettings(**settings_dict)
    save_admin_settings(new_settings)
    return {"settings": new_settings.dict()}

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from services.api.core.database import get_db
from services.api.db_models.user import User

@router.get("/users")
async def get_all_users(
    admin_email: str = Depends(require_admin),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(User))
    users = result.scalars().all()
    
    return {"users": [{
        "id": u.id,
        "email": u.email,
        "role": u.role,
        "is_active": getattr(u, 'is_active', True),
        "is_suspended": getattr(u, 'is_suspended', False),
        "admin_unblock_required": getattr(u, 'admin_unblock_required', False),
        "blocked_until": str(u.blocked_until) if getattr(u, 'blocked_until', None) else None,
        "created_at": str(u.created_at) if getattr(u, 'created_at', None) else None
    } for u in users]}

@router.post("/users/{user_id}/unblock")
async def unblock_user(
    user_id: int,
    admin_email: str = Depends(require_admin),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(User).filter(User.id == user_id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    user.failed_otp_attempts = 0
    user.otp_block_level = 0
    user.blocked_until = None
    user.admin_unblock_required = False
    
    db.add(user)
    await db.commit()
    return {"success": True, "message": f"User {user.email} unblocked successfully."}
