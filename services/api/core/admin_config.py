import json
import os
from pydantic import BaseModel
from services.api.core.config import settings

CONFIG_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "admin_settings.json")

class AdminSettings(BaseModel):
    admin_email: str = settings.ADMIN_EMAIL
    environment: str = settings.APP_ENV
    log_level: str = settings.LOG_LEVEL
    
    # OTP Progressive Rate Limiting & Lockout
    otp_rate_limit_enabled: bool = True
    otp_max_attempts: int = 3
    otp_block_duration_1_mins: int = 3
    otp_block_duration_2_mins: int = 10
    otp_block_duration_3_mins: int = 120
    otp_expiry_minutes: int = 3
    
    # Branding
    logo_light_url: str = ''
    logo_dark_url: str = ''
    browser_icon_url: str = ''

def get_admin_settings() -> AdminSettings:
    if os.path.exists(CONFIG_FILE):
        try:
            with open(CONFIG_FILE, "r") as f:
                data = json.load(f)
                return AdminSettings(**data)
        except:
            pass
    return AdminSettings()

def save_admin_settings(new_settings: AdminSettings):
    os.makedirs(os.path.dirname(CONFIG_FILE), exist_ok=True)
    with open(CONFIG_FILE, "w") as f:
        f.write(new_settings.json())
