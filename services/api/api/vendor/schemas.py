from pydantic import BaseModel
from typing import Optional, Dict

class VendorLogin(BaseModel):
    email: str
    password: str

class VendorCreateUser(BaseModel):
    email: str
    password: str
    full_name: Optional[str] = None

class VendorUpdateUser(BaseModel):
    full_name: Optional[str] = None
    password: Optional[str] = None
    is_suspended: Optional[bool] = None

class StaffCreate(BaseModel):
    email: str
    password: str
    permissions: Dict = {}
