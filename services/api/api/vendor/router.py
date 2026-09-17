from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
import os
import uuid
import shutil
import secrets as sc

from services.api.core.database import get_db
from services.api.core.security import get_current_user
from services.api.models.user import User
from services.api.db_models.system import AuditLog
from services.api.db_models.user import Device
from services.api.api.authentication.service import AuthenticationService
from services.api.api.vendor.schemas import VendorLogin, VendorCreateUser, VendorUpdateUser, StaffCreate

router = APIRouter(prefix="/vendor", tags=["vendor"])

async def require_vendor(current_user: User = Depends(get_current_user)):
    if current_user.role not in ("VENDOR", "VENDOR_STAFF", "ADMIN", "SUPER_ADMIN"):
        raise HTTPException(status_code=403, detail="Vendor access required")
    return current_user

@router.post("/login")
async def vendor_login(body: VendorLogin, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).filter(User.email == body.email))
    user = result.scalars().first()
    if not user or not AuthenticationService.verify_password(body.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if user.role not in ("VENDOR", "VENDOR_STAFF", "ADMIN", "SUPER_ADMIN"):
        raise HTTPException(status_code=403, detail="Access denied. Vendor portal only.")
        
    token = AuthenticationService.create_access_token(data={"sub": user.email, "role": user.role})
    return {"access_token": token, "token_type": "bearer", "user": {"email": user.email, "role": user.role}}

@router.get("/dashboard")
async def vendor_dashboard(db: AsyncSession = Depends(get_db), current_user: User = Depends(require_vendor)):
    employees_res = await db.execute(select(User).filter(User.vendor_id == current_user.id))
    employees = employees_res.scalars().all()
    
    device_count_res = await db.execute(
        select(func.count(Device.mac_address)).join(User).filter(User.vendor_id == current_user.id)
    )
    device_count = device_count_res.scalar()
    
    allocated = getattr(current_user, 'allocated_seats', 0)
    
    return {
        "success": True,
        "vendor_email": current_user.email,
        "total_employees": len(employees),
        "total_devices": device_count,
        "allocated_seats": allocated,
        "available_seats": max(0, allocated - len(employees)),
        "logo_url": getattr(current_user, 'logo_url', None)
    }

@router.get("/users")
async def list_vendor_users(db: AsyncSession = Depends(get_db), current_user: User = Depends(require_vendor)):
    employees_res = await db.execute(select(User).filter(User.vendor_id == current_user.id))
    employees = employees_res.scalars().all()
    return {"users": [{
        "id": u.id, "email": u.email, "full_name": getattr(u, 'full_name', ''), 
        "is_suspended": getattr(u, 'is_suspended', False), "created_at": str(u.created_at)
    } for u in employees]}

@router.post("/users")
async def vendor_create_user(body: VendorCreateUser, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_vendor)):
    used_res = await db.execute(select(func.count(User.id)).filter(User.vendor_id == current_user.id))
    used = used_res.scalar()
    
    allocated = getattr(current_user, 'allocated_seats', 0)
    if used >= allocated:
        raise HTTPException(status_code=400, detail="Seat limit reached. Purchase more seats.")
        
    exist_res = await db.execute(select(User).filter(User.email == body.email))
    if exist_res.scalars().first():
        raise HTTPException(status_code=400, detail="Email already registered")
        
    new_user = User(
        email=body.email,
        hashed_password=AuthenticationService.get_password_hash(body.password),
        full_name=body.full_name,
        role="USER",
        vendor_id=current_user.id,
        is_verified=True,
        is_premium=current_user.is_premium
    )
    db.add(new_user)
    
    audit = AuditLog(user_id=current_user.id, actor_email=current_user.email, event_type="VENDOR_USER_CREATED", details=f"Created employee {new_user.email}")
    db.add(audit)
    await db.commit()
    
    return {"success": True, "email": new_user.email}

@router.put("/users/{user_id}")
async def vendor_update_user(user_id: int, body: VendorUpdateUser, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_vendor)):
    res = await db.execute(select(User).filter(User.id == user_id, User.vendor_id == current_user.id))
    user = res.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found or not in your organization")
        
    if body.full_name is not None:
        user.full_name = body.full_name
    if body.password is not None:
        if len(body.password) < 8:
            raise HTTPException(status_code=400, detail="Password must be at least 8 characters")
        user.hashed_password = AuthenticationService.get_password_hash(body.password)
    if body.is_suspended is not None:
        user.is_suspended = body.is_suspended
        
    audit = AuditLog(user_id=current_user.id, actor_email=current_user.email, event_type="VENDOR_USER_UPDATED", details=f"Updated employee {user.email}")
    db.add(audit)
    await db.commit()
    return {"success": True, "user_id": user_id}

@router.delete("/users/{user_id}")
async def vendor_delete_user(user_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_vendor)):
    res = await db.execute(select(User).filter(User.id == user_id, User.vendor_id == current_user.id))
    user = res.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found or not in your organization")
        
    email = user.email
    await db.delete(user)
    audit = AuditLog(user_id=current_user.id, actor_email=current_user.email, event_type="VENDOR_USER_DELETED", details=f"Removed employee {email}")
    db.add(audit)
    await db.commit()
    return {"success": True}

@router.post("/users/{user_id}/reset-password")
async def vendor_reset_user_password(user_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_vendor)):
    res = await db.execute(select(User).filter(User.id == user_id, User.vendor_id == current_user.id))
    user = res.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    temp_pass = sc.token_urlsafe(8)
    user.hashed_password = AuthenticationService.get_password_hash(temp_pass)
    await db.commit()
    return {"success": True, "temp_password": temp_pass, "message": "Share this temporary password with the employee securely."}

@router.post("/users/{user_id}/reset-hardware")
async def vendor_reset_user_hardware(user_id: int, db: AsyncSession = Depends(get_db), vendor: User = Depends(require_vendor)):
    res = await db.execute(select(User).filter(User.id == user_id, User.vendor_id == vendor.id))
    user = res.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found or not in your organization.")
    
    devices_res = await db.execute(select(Device).filter(Device.user_id == user_id))
    for d in devices_res.scalars().all():
        await db.delete(d)

    audit = AuditLog(
        user_id=vendor.id, actor_email=vendor.email,
        event_type="HARDWARE_VENDOR_RESET",
        details=f"Vendor reset machine footprint for employee {user.email}"
    )
    db.add(audit)
    await db.commit()
    return {"success": True, "message": f"Hardware lock cleared for {user.email}"}

@router.post("/staff/create")
async def vendor_create_staff(body: StaffCreate, db: AsyncSession = Depends(get_db), vendor: User = Depends(require_vendor)):
    if vendor.role == "VENDOR_STAFF":
        raise HTTPException(status_code=403, detail="Vendor Staff cannot create other staff")
    
    res = await db.execute(select(User).filter(User.email == body.email))
    if res.scalars().first():
        raise HTTPException(status_code=400, detail="Staff email already exists")
    
    new_staff = User(
        email=body.email, 
        hashed_password=AuthenticationService.get_password_hash(body.password),
        role="VENDOR_STAFF",
        vendor_id=vendor.id,
        permissions=body.permissions,
        is_verified=True,
        is_premium=True
    )
    db.add(new_staff)
    audit = AuditLog(user_id=vendor.id, actor_email=vendor.email, event_type="VENDOR_STAFF_CREATED", details=f"Vendor created staff {new_staff.email}")
    db.add(audit)
    await db.commit()
    return {"success": True, "email": new_staff.email}

@router.post("/logo/upload")
async def vendor_upload_logo(file: UploadFile = File(...), db: AsyncSession = Depends(get_db), current_user: User = Depends(require_vendor)):
    logos_dir = os.path.join(os.path.dirname(__file__), "..", "..", "..", "Hide-Win-Web", "Admin", "logos", "vendor")
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
    await db.commit()
    return {"success": True, "logo_url": logo_url}

@router.get("/reports")
async def vendor_reports(db: AsyncSession = Depends(get_db), current_user: User = Depends(require_vendor)):
    employees_res = await db.execute(select(User).filter(User.vendor_id == current_user.id))
    employees = employees_res.scalars().all()
    
    allocated = getattr(current_user, 'allocated_seats', 0)
    return {
        "success": True,
        "report": {
            "vendor_id": current_user.id,
            "total_employees": len(employees),
            "active_employees": sum(1 for u in employees if not getattr(u, 'is_suspended', False)),
            "suspended_employees": sum(1 for u in employees if getattr(u, 'is_suspended', False)),
            "allocated_seats": allocated,
            "available_seats": allocated - len(employees),
            "employees": [{
                "id": u.id, "email": u.email, "full_name": getattr(u, 'full_name', ''),
                "is_suspended": getattr(u, 'is_suspended', False), "created_at": str(u.created_at),
            } for u in employees],
        }
    }

@router.post("/users/{user_id}/unblock")
async def vendor_unblock_user(user_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_vendor)):
    res = await db.execute(select(User).filter(User.id == user_id, User.vendor_id == current_user.id))
    user = res.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found or not in your organization")
        
    user.failed_otp_attempts = 0
    user.otp_block_level = 0
    user.blocked_until = None
    user.admin_unblock_required = False
    
    audit = AuditLog(user_id=current_user.id, actor_email=current_user.email, event_type="USER_UNBLOCKED", details=f"Unblocked employee {user.email}")
    db.add(audit)
    db.add(user)
    await db.commit()
    return {"success": True, "message": f"User {user.email} unblocked successfully."}
