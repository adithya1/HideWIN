"""
HideWIN Elite — Vendor Router (Full)
Vendor-specific: login, seat management, employee CRUD, reports.
"""
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
import db_models as models
import src.schemas.schemas as schemas
import os, shutil, uuid
from src.lib.database import get_db
from src.api.user.auth import get_current_user, create_access_token, verify_password, get_password_hash

router = APIRouter(prefix="/api/vendor", tags=["vendor"])


def require_vendor(current_user: models.User = Depends(get_current_user)):
    """Ensures the user is a VENDOR or has VENDOR_STAFF permissions."""
    if current_user.role not in ("VENDOR", "VENDOR_STAFF", "ADMIN", "SUPER_ADMIN"):
        raise HTTPException(status_code=403, detail="VENDOR or VENDOR_STAFF role required")
    return current_user

def has_vendor_permission(perm: str):
    """Dependency to check granular permissions for Vendor Staff."""
    def dependency(user: models.User = Depends(get_current_user)):
        if user.role in ("VENDOR", "ADMIN", "SUPER_ADMIN"): return user
        if user.role == "VENDOR_STAFF" and user.permissions.get(perm):
            return user
        raise HTTPException(status_code=403, detail=f"Vendor Staff permission '{perm}' required")
    return Depends(dependency)


# ─────────────────────────────────────────────────────────────
# AUTH
# ─────────────────────────────────────────────────────────────

class VendorLogin(BaseModel):
    email: str
    password: str

@router.post("/login")
def vendor_login(body: VendorLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == body.email).first()
    if not user or not verify_password(body.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if user.role != "VENDOR":
        raise HTTPException(status_code=403, detail="Access denied — not a vendor account")
    if user.is_suspended:
        raise HTTPException(status_code=403, detail="Vendor account suspended. Contact administrator.")
    token = create_access_token({"sub": user.email, "id": user.id, "role": user.role})
    return {
        "success": True, "token": token,
        "vendor": {
            "id": user.id, "email": user.email, "full_name": user.full_name,
            "allocated_seats": user.allocated_seats,
            "used_seats": db.query(models.User).filter(models.User.vendor_id == user.id).count(),
        }
    }


# ─────────────────────────────────────────────────────────────
# DASHBOARD METRICS
# ─────────────────────────────────────────────────────────────

@router.get("/dashboard")
def vendor_dashboard(db: Session = Depends(get_db), current_user: models.User = Depends(require_vendor)):
    employees = db.query(models.User).filter(models.User.vendor_id == current_user.id).all()
    device_count = db.query(models.Device).join(models.User).filter(models.User.vendor_id == current_user.id).count()
    return {
        "success": True,
        "vendor": {
            "id": current_user.id, "email": current_user.email,
            "full_name": current_user.full_name, "allocated_seats": current_user.allocated_seats,
            "used_seats": len(employees), "available_seats": current_user.allocated_seats - len(employees),
        },
        "total_employees": len(employees),
        "total_devices": device_count,
    }


# ─────────────────────────────────────────────────────────────
# EMPLOYEE (USER) CRUD
# ─────────────────────────────────────────────────────────────

@router.get("/users")
def list_vendor_users(db: Session = Depends(get_db), current_user: models.User = Depends(require_vendor)):
    employees = db.query(models.User).filter(models.User.vendor_id == current_user.id).all()
    return {"users": [{
        "id": u.id, "email": u.email, "full_name": u.full_name,
        "is_verified": u.is_verified, "is_suspended": u.is_suspended,
        "is_premium": u.is_premium, "created_at": str(u.created_at),
    } for u in employees]}


class VendorCreateUser(BaseModel):
    email: str
    password: str
    full_name: Optional[str] = None

@router.post("/users")
def vendor_create_user(body: VendorCreateUser, db: Session = Depends(get_db), current_user: models.User = Depends(require_vendor)):
    used = db.query(models.User).filter(models.User.vendor_id == current_user.id).count()
    if used >= current_user.allocated_seats:
        raise HTTPException(status_code=403, detail=f"Seat quota reached ({current_user.allocated_seats} seats). Purchase more seats.")
    if db.query(models.User).filter(models.User.email == body.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    new_user = models.User(
        email=body.email, password=get_password_hash(body.password),
        full_name=body.full_name, role="USER",
        vendor_id=current_user.id, is_premium=True, is_verified=True,
    )
    db.add(new_user); db.commit(); db.refresh(new_user)
    audit = models.AuditLog(user_id=current_user.id, actor_email=current_user.email, event_type="VENDOR_USER_CREATED", details=f"Created employee {new_user.email}")
    db.add(audit); db.commit()
    return {"success": True, "user_id": new_user.id, "email": new_user.email}


class VendorUpdateUser(BaseModel):
    full_name: Optional[str] = None
    password: Optional[str] = None
    is_suspended: Optional[bool] = None

@router.put("/users/{user_id}")
def vendor_update_user(user_id: int, body: VendorUpdateUser, db: Session = Depends(get_db), current_user: models.User = Depends(require_vendor)):
    user = db.query(models.User).filter(models.User.id == user_id, models.User.vendor_id == current_user.id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found or not in your organization")
    if body.full_name is not None:
        user.full_name = body.full_name
    if body.password is not None:
        if len(body.password) < 8:
            raise HTTPException(status_code=400, detail="Password must be at least 8 characters")
        user.password = get_password_hash(body.password)
    if body.is_suspended is not None:
        user.is_suspended = body.is_suspended
    audit = models.AuditLog(user_id=current_user.id, actor_email=current_user.email, event_type="VENDOR_USER_UPDATED", details=f"Updated employee {user.email}")
    db.add(audit); db.commit()
    return {"success": True, "user_id": user_id}

@router.delete("/users/{user_id}")
def vendor_delete_user(user_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(require_vendor)):
    user = db.query(models.User).filter(models.User.id == user_id, models.User.vendor_id == current_user.id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found or not in your organization")
    email = user.email
    db.delete(user); db.commit()
    audit = models.AuditLog(user_id=current_user.id, actor_email=current_user.email, event_type="VENDOR_USER_DELETED", details=f"Removed employee {email}")
    db.add(audit); db.commit()
    return {"success": True}

@router.post("/users/{user_id}/reset-password")
def vendor_reset_user_password(user_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(require_vendor)):
    """Vendor resets an employee's password to a temp value."""
    user = db.query(models.User).filter(models.User.id == user_id, models.User.vendor_id == current_user.id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    import secrets as sc
    temp_pass = sc.token_urlsafe(8)
    user.password = get_password_hash(temp_pass)
    db.commit()
    return {"success": True, "temp_password": temp_pass, "message": "Share this temporary password with the employee securely."}

@router.post("/users/{user_id}/reset-hardware")
def vendor_reset_user_hardware(
    user_id: int,
    db: Session = Depends(get_db),
    vendor: models.User = Depends(require_vendor)
):
    """Allows a Vendor to clear the hardware footprint of an employee (Managed Migration)."""
    user = db.query(models.User).filter(models.User.id == user_id, models.User.vendor_id == vendor.id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found or not in your organization.")
    
    # Clear device footprints
    db.query(models.Device).filter(models.Device.user_id == user_id).delete()
    db.commit()

    audit = models.AuditLog(
        user_id=vendor.id, actor_email=vendor.email,
        event_type="HARDWARE_VENDOR_RESET",
        details=f"Vendor reset machine footprint for employee {user.email}"
    )
    db.add(audit); db.commit()
    return {"success": True, "message": f"Hardware lock cleared for {user.email}"}

@router.post("/staff/create")
def vendor_create_staff(
    body: schemas.StaffCreate,
    db: Session = Depends(get_db),
    vendor: models.User = Depends(require_vendor)
):
    """Allows a Vendor to create staff with restricted access (e.g. view billing only)."""
    if vendor.role == "VENDOR_STAFF":
        raise HTTPException(status_code=403, detail="Vendor Staff cannot create other staff")
    
    if db.query(models.User).filter(models.User.email == body.email).first():
        raise HTTPException(status_code=400, detail="Staff email already exists")
    
    new_staff = models.User(
        email=body.email, 
        password=get_password_hash(body.password),
        role="VENDOR_STAFF",
        vendor_id=vendor.id,      # Scoped to THIS vendor
        permissions=body.permissions,
        is_verified=True,
        is_premium=True
    )
    db.add(new_staff); db.commit(); db.refresh(new_staff)
    audit = models.AuditLog(user_id=vendor.id, actor_email=vendor.email, event_type="VENDOR_STAFF_CREATED", details=f"Vendor created staff {new_staff.email}")
    db.add(audit); db.commit()
    return {"success": True, "staff_id": new_staff.id, "email": new_staff.email}


# ─────────────────────────────────────────────────────────────
# BRANDING
# ─────────────────────────────────────────────────────────────

@router.post("/logo/upload")
async def vendor_upload_logo(file: UploadFile = File(...), db: Session = Depends(get_db), current_user: models.User = Depends(require_vendor)):
    logos_dir = os.path.join(os.path.dirname(__file__), "..", "../Hide-Win-Web/Admin", "logos", "vendor")
    os.makedirs(logos_dir, exist_ok=True)
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in [".png", ".jpg", ".jpeg", ".svg", ".webp"]:
        raise HTTPException(status_code=400, detail="Unsupported file type")
    filename = f"vendor_{current_user.id}_{uuid.uuid4().hex[:6]}{ext}"
    filepath = os.path.join(logos_dir, filename)
    with open(filepath, "wb") as f:
        shutil.copyfileobj(file.file, f)
    logo_url = f"/logos/vendor/{filename}"
    current_user.logo_url = logo_url
    db.commit()
    return {"success": True, "logo_url": logo_url}


# ─────────────────────────────────────────────────────────────
# REPORTS
# ─────────────────────────────────────────────────────────────

@router.get("/reports")
def vendor_reports(db: Session = Depends(get_db), current_user: models.User = Depends(require_vendor)):
    employees = db.query(models.User).filter(models.User.vendor_id == current_user.id).all()
    return {
        "success": True,
        "report": {
            "vendor_id": current_user.id,
            "total_employees": len(employees),
            "active_employees": sum(1 for u in employees if not u.is_suspended),
            "suspended_employees": sum(1 for u in employees if u.is_suspended),
            "allocated_seats": current_user.allocated_seats,
            "available_seats": current_user.allocated_seats - len(employees),
            "employees": [{
                "id": u.id, "email": u.email, "full_name": u.full_name,
                "is_suspended": u.is_suspended, "created_at": str(u.created_at),
            } for u in employees],
        }
    }
