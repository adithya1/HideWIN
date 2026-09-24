from fastapi import APIRouter, Depends, HTTPException, Query, status, Request
from sqlalchemy import func
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
    return {"settings": settings.public_dict()}

@router.post("/settings")
async def update_admin_settings(
    request: Request,
    admin_email: str = Depends(require_admin),
    settings: AdminSettings = Depends(get_admin_settings)
):
    data = await request.json()
    settings_dict = settings.dict()
    for k, v in data.items():
        if k in settings_dict and not (k in {"smtp_pass", "google_client_secret", "outlook_client_secret"} and not v):
            settings_dict[k] = v
    new_settings = AdminSettings(**settings_dict)
    save_admin_settings(new_settings)
    return {"settings": new_settings.public_dict()}

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from services.api.core.database import get_db
from services.api.db_models.user import User

@router.get("/users")
async def get_all_users(
    admin_email: str = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0),
):
    total_result = await db.execute(select(func.count(User.id)))
    total = int(total_result.scalar_one())
    result = await db.execute(select(User).order_by(User.id).limit(limit).offset(offset))
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
    } for u in users], "total": total, "limit": limit, "offset": offset}

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

from pydantic import BaseModel
from services.api.services.email_service import EmailService

class SmtpConfig(BaseModel):
    smtp_host: str
    smtp_port: int
    smtp_user: str
    smtp_pass: str

@router.put("/smtp")
async def update_smtp(
    config: SmtpConfig,
    admin_email: str = Depends(require_admin),
    settings: AdminSettings = Depends(get_admin_settings)
):
    settings.smtp_host = config.smtp_host
    settings.smtp_port = config.smtp_port
    settings.smtp_user = config.smtp_user
    if config.smtp_pass:
        settings.smtp_pass = config.smtp_pass
    save_admin_settings(settings)
    return {"success": True, "config": settings.public_dict()}

@router.get("/smtp")
async def get_smtp(
    admin_email: str = Depends(require_admin),
    settings: AdminSettings = Depends(get_admin_settings)
):
    return {"config": {"smtp_host": settings.smtp_host, "smtp_port": settings.smtp_port, "smtp_user": settings.smtp_user, "smtp_pass_configured": bool(settings.smtp_pass)}}

class TestEmailRequest(BaseModel):
    test_email: str

@router.post("/smtp/test")
async def test_smtp(
    req: TestEmailRequest,
    admin_email: str = Depends(require_admin),
    db: AsyncSession = Depends(get_db)
):
    success = await EmailService.send_email(
        db=db,
        to_email=req.test_email,
        subject="HideWin SMTP Test",
        content="<p>This is a test email to verify your SMTP configuration.</p>"
    )
    if success:
        return {"success": True, "message": "Test email sent successfully"}
    else:
        raise HTTPException(status_code=500, detail="Failed to send test email. Check server logs.")


# ─── /api/admin/user/* — User Management Endpoints ───────────────────────────
# The Admin dashboard frontend calls these under /api/admin prefix.

api_admin_router = APIRouter(prefix="/api/admin", tags=["admin-user-management"])

def require_api_admin(
    current_user=Depends(get_current_user),
    admin_settings: AdminSettings = Depends(get_admin_settings)
):
    if current_user.email != admin_settings.admin_email and current_user.role not in ("ADMIN", "SUPER_ADMIN"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin privileges required")
    return current_user.email


class CreateUserRequest(BaseModel):
    email: str
    password: str


class UpdateRoleRequest(BaseModel):
    role: str


@api_admin_router.post("/user/create")
async def create_user(
    role: str = "USER",
    body: CreateUserRequest = None,
    admin_email: str = Depends(require_api_admin),
    db: AsyncSession = Depends(get_db)
):
    """Create / invite a new user from the Admin dashboard."""
    from sqlalchemy.future import select as sa_select
    from services.api.api.authentication.service import AuthenticationService

    if not body or not body.email or not body.password:
        raise HTTPException(status_code=400, detail="Email and password are required")

    # Check if user already exists
    existing = await db.execute(sa_select(User).filter(User.email == body.email))
    if existing.scalars().first():
        raise HTTPException(status_code=409, detail="A user with that email already exists")

    new_user = User(
        email=body.email,
        hashed_password=AuthenticationService.get_password_hash(body.password),
        role=role.upper(),
        is_active=True,
        is_verified=True,  # Admin-created users are pre-verified
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return {"success": True, "message": f"User {new_user.email} created successfully", "id": new_user.id}


@api_admin_router.delete("/user/{user_id}")
async def delete_user(
    user_id: int,
    admin_email: str = Depends(require_api_admin),
    db: AsyncSession = Depends(get_db)
):
    """Permanently delete a user from the Admin dashboard."""
    from sqlalchemy.future import select as sa_select

    result = await db.execute(sa_select(User).filter(User.id == user_id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    await db.delete(user)
    await db.commit()
    return {"success": True, "message": f"User {user.email} deleted"}


@api_admin_router.put("/user/{user_id}/role")
async def update_user_role(
    user_id: int,
    body: UpdateRoleRequest,
    admin_email: str = Depends(require_api_admin),
    db: AsyncSession = Depends(get_db)
):
    """Update a user's role from the Admin dashboard."""
    from sqlalchemy.future import select as sa_select

    result = await db.execute(sa_select(User).filter(User.id == user_id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.role = body.role.upper()
    db.add(user)
    await db.commit()
    return {"success": True, "message": f"User {user.email} role updated to {user.role}"}
