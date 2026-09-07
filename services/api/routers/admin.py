from fastapi import APIRouter, Depends, HTTPException, status
from services.api.core.admin_config import AdminSettings, get_admin_settings
from services.api.core.security import get_current_user

router = APIRouter(prefix="/admin", tags=["admin"])

def require_admin(email: str = Depends(get_current_user), admin_settings: AdminSettings = Depends(get_admin_settings)):
    """Dependency to ensure the current user is the administrator."""
    if email != admin_settings.admin_email:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin privileges required")
    return email

@router.get("/settings", response_model=AdminSettings)
async def read_admin_settings(
    admin_email: str = Depends(require_admin),
    settings: AdminSettings = Depends(get_admin_settings)
):
    """
    Retrieves the current runtime administrator settings.
    Requires Admin JWT.
    """
    return settings
