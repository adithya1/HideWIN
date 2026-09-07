from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from services.api.core.database import get_db
from services.api.api.users.repository import UserRepository
from services.api.api.authentication.service import AuthenticationService
from services.api.schemas.auth_schema import UserCreate, UserResponse, Token
from services.api.models.user import User

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def signup(user_data: UserCreate, db: AsyncSession = Depends(get_db)):
    repo = UserRepository(db)
    existing_user = await repo.get_user_by_email(user_data.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    hashed_password = AuthenticationService.get_password_hash(user_data.password)
    new_user = User(email=user_data.email, hashed_password=hashed_password)
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    
    return UserResponse(id=new_user.id, email=new_user.email, is_active=new_user.is_active)

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    repo = UserRepository(db)
    user = await repo.get_user_by_email(form_data.username)
    if not user or (not OTPService.verify_otp(form_data.username, form_data.password) and not AuthenticationService.verify_password(form_data.password, user.hashed_password)):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    access_token = AuthenticationService.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}
from services.api.schemas.auth_schema import SendOtpRequest
from services.api.api.authentication.service import OTPService

@router.post("/send-otp")
async def send_otp(body: SendOtpRequest, db: AsyncSession = Depends(get_db)):
    result = OTPService.send_otp(body.email, db)
    return result
from services.api.schemas.auth_schema import ForgotPasswordRequest, ResetPasswordRequest
from services.api.api.authentication.password_service import PasswordService

@router.post("/forgot-password")
async def forgot_password(body: ForgotPasswordRequest, db: AsyncSession = Depends(get_db)):
    return await PasswordService.request_password_reset(body.email, db)

@router.post("/reset-password")
async def reset_password(body: ResetPasswordRequest, db: AsyncSession = Depends(get_db)):
    try:
        return await PasswordService.reset_password(body.token, body.new_password, db)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
from services.api.schemas.auth_schema import InviteRequest
from services.api.api.authentication.invitation_service import InvitationService
from services.api.core.security import get_current_user
from services.api.models.user import User

@router.post("/send-invites")
async def send_invites(
    body: InviteRequest, 
    db: AsyncSession = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    return await InvitationService.send_invites(body.emails, current_user, db)
from fastapi.responses import RedirectResponse
from services.api.api.authentication.oauth.google import GoogleOAuthService

@router.get("/google/login")
async def google_login(db: AsyncSession = Depends(get_db)):
    url = await GoogleOAuthService.get_login_url(db)
    return RedirectResponse(url=url)

@router.get("/google/callback")
async def google_callback(code: str, db: AsyncSession = Depends(get_db)):
    user = await GoogleOAuthService.handle_callback(code, db)
    access_token = AuthenticationService.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/sso/{provider}/login")
async def oauth_login(provider: str, db: AsyncSession = Depends(get_db)):
    if provider == "google": return await google_login(db=db)
    raise HTTPException(status_code=400, detail=f"Unsupported provider: {provider}")

@router.get("/sso/{provider}/callback")
async def oauth_callback(provider: str, code: str, db: AsyncSession = Depends(get_db)):
    if provider == "google": return await google_callback(code=code, db=db)
    raise HTTPException(status_code=400, detail=f"Unsupported provider: {provider}")
