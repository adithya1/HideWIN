from pydantic import BaseModel, EmailStr
from typing import Optional, List

class UserLogin(BaseModel):
    email: str
    password: str
    macAddress: Optional[str] = None

class UserCreate(BaseModel):
    email: str
    password: str
    macAddress: Optional[str] = None

class VendorCreate(BaseModel):
    email: str
    password: str
    allocated_seats: int = 10
    full_name: Optional[str] = None

class VendorManageSeats(BaseModel):
    seats: int

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[str] = None
    email_notifications: Optional[bool] = None

class ChangePasswordRequest(BaseModel):
    old_password: str
    new_password: str

class PlanCreate(BaseModel):
    name: str
    slug: str
    price_monthly: float
    features: List[str] = []
    seat_limit: Optional[int] = None
    stripe_price_id: Optional[str] = None

class PlanUpdate(BaseModel):
    name: Optional[str] = None
    price_monthly: Optional[float] = None
    features: Optional[List[str]] = None
    seat_limit: Optional[int] = None
    stripe_price_id: Optional[str] = None
    is_active: Optional[bool] = None

class SubscribeRequest(BaseModel):
    plan_slug: str
    stripe_payment_method_id: Optional[str] = None   # For Stripe integration

class InviteRequest(BaseModel):
    emails: List[str]

# ── Administrative Hierarchy Schemas ──

class StaffCreate(UserCreate):
    permissions: dict = {}      # Example: {"view_payments": true, "manage_users": true}

class AdminUserResponse(BaseModel):
    id: int
    email: str
    role: str
    permissions: dict
    created_at: str

    class Config:
        from_attributes = True

# -- AI Proxy Architecture Schemas --
class AiProviderKeyCreate(BaseModel):
    provider: str
    api_key_value: str
    custom_url: Optional[str] = None
    is_enabled: Optional[bool] = True

class AiProviderKeyResponse(BaseModel):
    id: int
    provider: str
    custom_url: Optional[str] = None
    api_key_value: str # In production, this should be masked/encrypted when sent to UI
    is_enabled: bool
    status: str
    quota_usage: int

    class Config:
        from_attributes = True

class AppSettingCreate(BaseModel):
    setting_key: str
    setting_value: str

class AppSettingResponse(BaseModel):
    id: int
    setting_key: str
    setting_value: str

    class Config:
        from_attributes = True


class SMTPConfigUpdate(BaseModel):
    smtp_host: str
    smtp_port: int
    smtp_user: str
    smtp_pass: str
    smtp_from_name: Optional[str] = None      # Display name e.g. "HideWin Team"
    smtp_from_email: Optional[str] = None     # Dedicated from address (falls back to smtp_user)
    smtp_ssl: Optional[bool] = False          # True = SSL (port 465), False = STARTTLS (port 587)

class SMTPTestRequest(BaseModel):
    test_email: str

