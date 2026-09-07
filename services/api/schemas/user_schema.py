from pydantic import BaseModel
from typing import Optional

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[str] = None
    email_notifications: Optional[bool] = None

class ChangePasswordRequest(BaseModel):
    old_password: str
    new_password: str
