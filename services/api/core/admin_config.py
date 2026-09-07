from pydantic import BaseModel
from services.api.core.config import settings

class AdminSettings(BaseModel):
    """
    Represents the runtime administrator settings.
    """
    admin_email: str = settings.ADMIN_EMAIL
    environment: str = settings.APP_ENV
    log_level: str = settings.LOG_LEVEL

def get_admin_settings() -> AdminSettings:
    return AdminSettings()
