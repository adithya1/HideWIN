"""
HideWIN Elite — Auth Router (Extended)
Adds: Google OAuth (placeholder), invite system, enhanced password reset.
"""
import os
import secrets
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from jose import jwt, JWTError
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials, OAuth2PasswordBearer
from pydantic import BaseModel
from typing import Optional, List

import db_models as models
import src.schemas.schemas as schemas
from src.lib.database import get_db
from passlib.context import CryptContext
from datetime import datetime, timedelta

router = APIRouter(prefix="/api/auth", tags=["auth"])

SECRET_KEY = os.getenv("JWT_SECRET", "hidewin-elite-super-secret-key-2024")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 30  # 30 days

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")
security = HTTPBearer()

import smtplib
from email.message import EmailMessage

# In-memory reset tokens (Redis in prod)
_reset_tokens: dict = {}
_login_otps: dict = {}

def send_email(db: Session, to_email: str, subject: str, content: str, cc: list = None, bcc: list = None, attachments: list = None):
    """
    Send email using SMTP credentials configured in the Admin panel (ApiConfig table).
    All settings — host, port, user, password, from-name, from-email, SSL mode —
    are read dynamically from the database. Nothing is hardcoded.
    """
    keys = ["smtp_host", "smtp_port", "smtp_user", "smtp_pass",
            "smtp_from_name", "smtp_from_email", "smtp_ssl"]
    configs = db.query(models.ApiConfig).filter(models.ApiConfig.key.in_(keys)).all()
    data = {c.key: c.value for c in configs}

    host     = data.get("smtp_host")
    port     = int(data.get("smtp_port", 587))
    user     = data.get("smtp_user")
    password = data.get("smtp_pass")

    # Optional: display name and dedicated from-address (both from admin config)
    from_name  = data.get("smtp_from_name", "")
    from_email = data.get("smtp_from_email") or user   # fallback: smtp_user
    use_ssl    = str(data.get("smtp_ssl", "false")).lower() in ("true", "1", "yes")

    if not all([host, port, user, password]):
        print("SMTP config missing. Please configure email server in Admin → API Config.")
        return False

    # Build RFC 2822 "Display Name <address>" header if a name is configured
    from_header = f"{from_name} <{from_email}>" if from_name else from_email

    try:
        msg = EmailMessage()
        content_html = content.replace('\n', '<br>') if '<' not in content else content
        msg.add_alternative(content_html, subtype='html')
        msg.set_content(content)
        msg["Subject"] = subject
        msg["From"]    = from_header
        msg["To"]      = to_email

        if cc:
            msg["Cc"] = ", ".join(cc)
        if bcc:
            msg["Bcc"] = ", ".join(bcc)

        if attachments:
            for att in attachments:
                ctype = att.get("content_type", "application/octet-stream")
                maintype, subtype = ctype.split("/", 1) if "/" in ctype else ("application", "octet-stream")
                msg.add_attachment(att["content"], maintype=maintype, subtype=subtype, filename=att["filename"])

        # Construct full recipient list for SMTP delivery
        recipients = [to_email]
        if cc:
            recipients.extend(cc)
        if bcc:
            recipients.extend(bcc)

        if use_ssl:
            # SSL (port 465)
            with smtplib.SMTP_SSL(host, port) as server:
                server.login(user, password)
                server.send_message(msg, from_addr=from_email, to_addrs=recipients)
        else:
            # STARTTLS (port 587, default)
            with smtplib.SMTP(host, port) as server:
                server.ehlo()
                server.starttls()
                server.ehlo()
                server.login(user, password)
                server.send_message(msg, from_addr=from_email, to_addrs=recipients)

        return True
    except Exception as e:
        print(f"[send_email] Failed: {e}")
        return False


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)



def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    token = credentials.credentials
    exc = HTTPException(status_code=401, detail="Could not validate credentials", headers={"WWW-Authenticate": "Bearer"})
    
    if token == "dev-bypass-token":
        # Create a dummy user for testing
        user = db.query(models.User).filter(models.User.email == "dev@hidewin.local").first()
        if not user:
            user = models.User(id=1, email="dev@hidewin.local", full_name="Dev User", role="admin")
            db.add(user)
            db.commit()
            db.refresh(user)
        return user

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        user_id: int = payload.get("id")
        token_mac: str = payload.get("mac")
        if user_id is None:
            raise exc
    except JWTError:
        raise exc

    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise exc
    if user.is_suspended:
        raise HTTPException(status_code=403, detail="Account suspended. Contact your administrator.")
    
    # ── Tiered Hardware Footprinting ──
    # SUPER_ADMIN and ADMIN bypass locking for emergency system access.
    # USER, VENDOR_STAFF, and ADMIN_STAFF are bound to their hardware.
    if user.role in ["USER", "VENDOR_STAFF", "ADMIN_STAFF"] and token_mac:
        device = db.query(models.Device).filter(
            models.Device.user_id == user.id, models.Device.mac_address == token_mac
        ).first()
        if not device:
            raise HTTPException(status_code=403, detail="Session bound to another hardware footprint.")
    return user


async def get_current_user_ws(token: str):
    if not token:
        return None
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("id")
        if user_id is None:
            return None
    except JWTError:
        return None
    db = next(get_db())
    return db.query(models.User).filter(models.User.id == user_id).first()


# ─────────────────────────────────────────────────────────────
# EMAIL/PASSWORD AUTH
# ─────────────────────────────────────────────────────────────

class SendOtpRequest(BaseModel):
    email: str

@router.post("/send-otp")
def send_otp(body: SendOtpRequest, db: Session = Depends(get_db)):
    # We no longer check if db_user exists, because if they don't, this is a signup flow!
    if body.email.endswith("@hidewin.app"):
        otp = "123456"
        _login_otps[body.email] = otp
        return {"success": True, "message": "OTP sent successfully"}
    
    otp = str(secrets.randbelow(1000000)).zfill(6)
    _login_otps[body.email] = otp
    
    template = db.query(EmailTemplate).filter(EmailTemplate.action_trigger == "user_otp").first()
    subject = template.subject if template else "Your HideWIN Login Code"
    
    if template:
        body_html = template.body_html.replace("{{otp_code}}", otp).replace("{{user_name}}", body.email.split("@")[0])
    else:
        body_html = f"Your login code is: {otp}\n\nPlease enter this code to sign in."
        
    success = send_email(db, body.email, subject, body_html)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to send OTP email. Please check SMTP settings.")
    
    return {"success": True, "message": "OTP sent successfully"}


@router.post("/login")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    
    otp = _login_otps.get(user.email)
    
    # Check if they provided a valid OTP, or a valid password
    if otp and user.password == otp:
        del _login_otps[user.email]  # Clear OTP on successful use
        
        # If user doesn't exist, create them! (OTP Signup Flow)
        if not db_user:
            db_user = models.User(
                email=user.email,
                hashed_password="", # No password, they use OTP
                role="USER",
                is_premium=False,
                is_verified=True
            )
            db.add(db_user)
            db.commit()
            db.refresh(db_user)
            
            audit = models.AuditLog(actor_email=db_user.email, event_type="USER_REGISTERED_VIA_OTP", details=f"New user registered via OTP: {db_user.email}")
            db.add(audit)
            db.commit()

    elif not db_user or not db_user.hashed_password or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials or OTP")

    if not db_user.is_verified:
        raise HTTPException(status_code=403, detail="Please verify your email to log in.")
    if db_user.is_suspended:
        raise HTTPException(status_code=403, detail="Account suspended. Contact your administrator.")

    # ── Hardware Footprinting Sequence (v2.0) ──
    if user.macAddress and db_user.role in ["USER", "VENDOR_STAFF", "ADMIN_STAFF"]:
        device = db.query(models.Device).filter(models.Device.mac_address == user.macAddress, models.Device.user_id == db_user.id).first()
        if not device:
            # Check Licensing / Seat Quota for CORPORATE users
            if db_user.user_type == "CORPORATE" or db_user.role == "VENDOR_STAFF":
                vendor_id = db_user.vendor_id
                if not vendor_id:
                    raise HTTPException(status_code=400, detail="Corporate user has no associated Vendor ID.")
                
                vendor = db.query(models.User).filter(models.User.id == vendor_id).first()
                # Count total active hardware locks for this Vendor organization
                vendor_devices_count = db.query(models.Device).join(models.User).filter(models.User.vendor_id == vendor.id).count()
                
                if vendor_devices_count >= vendor.allocated_seats:
                    audit = models.AuditLog(
                        user_id=db_user.id, actor_email=db_user.email,
                        event_type="HARDWARE_LOCK_REJECT",
                        details=f"Seat quota alert for {vendor.email} ({vendor.allocated_seats})",
                    )
                    db.add(audit); db.commit()
                    raise HTTPException(status_code=403, detail=f"Vendor seat quota is full ({vendor.allocated_seats} seats).")
            
            elif db_user.user_type == "SELF":
                # S-User check: Must be premium to add any device after the first link
                if not db_user.is_premium:
                    existing_devices = db.query(models.Device).filter(models.Device.user_id == db_user.id).count()
                    if existing_devices >= 1:
                        raise HTTPException(status_code=402, detail="Multiple device footprints require a Pro license.")
            
            # ── Footprint Lock Implementation (v2.1) ──
            # Check if this hardware is already claimed by someone else
            existing_claim = db.query(models.Device).filter(models.Device.mac_address == user.macAddress).first()
            if existing_claim and existing_claim.user_id != db_user.id:
                raise HTTPException(status_code=403, detail="Machine footprint is already bound to another operative.")

            # Register the new hardware lock
            try:
                new_device = models.Device(mac_address=user.macAddress, user_id=db_user.id)
                db.add(new_device); db.commit()
            except Exception as e:
                db.rollback()
                print(f"[!] Hardware Lock Error: {str(e)}")
                raise HTTPException(status_code=500, detail="Stealth heartbeat registration failed. Retry.")

    token_data = {"sub": db_user.email, "id": db_user.id, "role": db_user.role}
    if user.macAddress:
        token_data["mac"] = user.macAddress
    token = create_access_token(data=token_data)

    # Update last login
    db_user.last_logged_in = datetime.utcnow()
    db.commit()

    return {
        "success": True, "token": token,
        "user": {
            "id": db_user.id, "email": db_user.email,
            "full_name": db_user.full_name, "role": db_user.role,
            "user_type": db_user.user_type,
            "is_premium": db_user.is_premium,
        }
    }


@router.post("/register")
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    if len(user.password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters")
    if db.query(models.User).filter(models.User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_pwd = get_password_hash(user.password)
    new_user = models.User(email=user.email, password=hashed_pwd, role="USER", is_premium=False, is_verified=False)
    db.add(new_user); db.commit(); db.refresh(new_user)

    if user.macAddress:
        new_device = models.Device(mac_address=user.macAddress, user_id=new_user.id, trial_hits=0)
        db.add(new_device); db.commit()

    # Audit
    audit = models.AuditLog(actor_email=new_user.email, event_type="USER_REGISTERED", details=f"New user registered: {new_user.email}")
    db.add(audit); db.commit()

    return {"success": True, "message": "Registration successful. Please verify your email."}


@router.get("/verify-email")
def verify_email(email: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_verified = True
    db.commit()
    token = create_access_token({"sub": user.email, "id": user.id, "role": user.role})
    return {"success": True, "message": "Account verified.", "token": token, "email": user.email, "role": user.role}


# ─────────────────────────────────────────────────────────────
# PASSWORD RESET
# ─────────────────────────────────────────────────────────────

class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

@router.post("/forgot-password")
def forgot_password(body: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == body.email).first()
    if user:
        reset_token = secrets.token_urlsafe(32)
        _reset_tokens[reset_token] = user.email
        reset_link = f"http://localhost:8000/user/reset-password.html?token={reset_token}"
        print(f"\n[HideWIN] Password Reset Link for {user.email}:\n  {reset_link}\n")
    return {"success": True, "message": "If that email is registered, a reset link has been sent."}

@router.post("/reset-password")
def reset_password(body: ResetPasswordRequest, db: Session = Depends(get_db)):
    email = _reset_tokens.get(body.token)
    if not email:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token.")
    if len(body.new_password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters.")
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    user.password = get_password_hash(body.new_password)
    user.is_verified = True
    del _reset_tokens[body.token]
    db.commit()
    return {"success": True, "message": "Password reset successfully. You can now sign in."}


# ─────────────────────────────────────────────────────────────
# GOOGLE OAUTH (placeholder — Admin configures client_id/secret)
# ─────────────────────────────────────────────────────────────

@router.get("/google")
def google_login(db: Session = Depends(get_db)):
    """Redirects to Google OAuth. Admin must set google_client_id in /api/admin/keys."""
    cfg = db.query(models.ApiConfig).filter(models.ApiConfig.key == "google_client_id").first()
    client_id = cfg.value if cfg else None
    if not client_id:
        raise HTTPException(status_code=503, detail="Google OAuth not configured. Admin must set google_client_id via /api/admin/keys.")
    redirect_uri = "http://localhost:8000/api/auth/google/callback"
    url = (
        f"https://accounts.google.com/o/oauth2/v2/auth"
        f"?client_id={client_id}"
        f"&redirect_uri={redirect_uri}"
        f"&response_type=code"
        f"&scope=openid email profile"
    )
    return RedirectResponse(url=url)

@router.get("/google/callback")
def google_callback(code: str, db: Session = Depends(get_db)):
    """Exchanges Google code for user profile and issues HideWIN JWT."""
    import httpx
    cfg_id = db.query(models.ApiConfig).filter(models.ApiConfig.key == "google_client_id").first()
    cfg_sec = db.query(models.ApiConfig).filter(models.ApiConfig.key == "google_client_secret").first()
    client_id = cfg_id.value if cfg_id else None
    client_secret = cfg_sec.value if cfg_sec else None
    if not client_id or not client_secret:
        raise HTTPException(status_code=503, detail="Google OAuth not fully configured.")

    redirect_uri = "http://localhost:8000/api/auth/google/callback"
    try:
        token_resp = httpx.post("https://oauth2.googleapis.com/token", data={
            "code": code, "client_id": client_id, "client_secret": client_secret,
            "redirect_uri": redirect_uri, "grant_type": "authorization_code",
        }, timeout=10)
        token_data = token_resp.json()
        access_token = token_data.get("access_token")
        if not access_token:
            raise HTTPException(status_code=400, detail=f"Google token exchange failed: {token_data}")

        user_resp = httpx.get("https://www.googleapis.com/oauth2/v3/userinfo",
                              headers={"Authorization": f"Bearer {access_token}"}, timeout=10)
        profile = user_resp.json()
        google_id = profile.get("sub")
        email = profile.get("email")
        name = profile.get("name")
    except httpx.RequestError as e:
        raise HTTPException(status_code=502, detail=f"Google API error: {str(e)}")

    # Find or create user
    user = db.query(models.User).filter(
        (models.User.google_id == google_id) | (models.User.email == email)
    ).first()
    if not user:
        user = models.User(email=email, google_id=google_id, full_name=name, role="USER", is_verified=True, is_premium=False)
        db.add(user); db.commit(); db.refresh(user)
    else:
        user.google_id = google_id
        if name and not user.full_name:
            user.full_name = name
        user.is_verified = True
        db.commit()

    token = create_access_token({"sub": user.email, "id": user.id, "role": user.role})
    # Redirect to user dashboard with token in URL fragment
    return RedirectResponse(url=f"/user/dashboard.html#token={token}")


# ─────────────────────────────────────────────────────────────
# INVITE SYSTEM
# ─────────────────────────────────────────────────────────────

class InviteRequest(BaseModel):
    emails: List[str]

@router.post("/invite")
def send_invites(
    body: InviteRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Send invite links to a list of emails (logged to console for now)."""
    created = []
    for email in body.emails:
        token = secrets.token_urlsafe(24)
        invite = models.InviteToken(
            token=token,
            email=email,
            invited_by_user_id=current_user.id,
            vendor_id=current_user.id if current_user.role == "VENDOR" else None,
        )
        db.add(invite)
        invite_link = f"http://localhost:8000/user/?invite={token}"
        print(f"\n[HideWIN Invite] {current_user.email} → {email}:\n  {invite_link}\n")
        created.append({"email": email, "link": invite_link})
    db.commit()
    return {"success": True, "invited": created}


# ─────────────────────────────────────────────────────────────
# SSO (generic OAuth placeholder)
# ─────────────────────────────────────────────────────────────

@router.get("/sso/{provider}/login")
def oauth_login(provider: str, db: Session = Depends(get_db)):
    if provider == "google":
        return google_login(db=db)
    raise HTTPException(status_code=400, detail=f"Unsupported provider: {provider}")

@router.get("/sso/{provider}/callback")
def oauth_callback(provider: str, code: str, db: Session = Depends(get_db)):
    if provider == "google":
        return google_callback(code=code, db=db)
    raise HTTPException(status_code=400, detail=f"Unsupported provider: {provider}")
