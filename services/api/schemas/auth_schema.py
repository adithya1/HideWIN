from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    is_active: bool

class Token(BaseModel):
    access_token: str
    token_type: str
    hash: str | None = None
from pydantic import BaseModel, EmailStr

class SendOtpRequest(BaseModel):
    email: EmailStr
class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str
from typing import List

class InviteRequest(BaseModel):
    emails: List[EmailStr]
