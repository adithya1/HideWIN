"""
HideWIN Elite — User Profile Router
Handles authenticated user profile management, password changes, and account operations.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
import db_models as models
import src.schemas.schemas as schemas
from src.lib.database import get_db
from src.api.user.auth import get_current_user, verify_password, get_password_hash

router = APIRouter(prefix="/api/user", tags=["user"])


# ─────────────────────────────────────────────────────────────
# PROFILE
# ─────────────────────────────────────────────────────────────

@router.get("/profile")
def get_my_profile(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Return the authenticated user's full profile."""
    sub = current_user.subscription
    devices_count = len(current_user.devices)
    return {
        "success": True,
        "user": {
            "id": current_user.id,
            "email": current_user.email,
            "full_name": current_user.full_name,
            "role": current_user.role,
            "is_premium": current_user.is_premium,
            "is_verified": current_user.is_verified,
            "is_suspended": current_user.is_suspended,
            "email_notifications": current_user.email_notifications,
            "created_at": str(current_user.created_at),
            "google_connected": bool(current_user.google_id),
            "devices_registered": devices_count,
            "plan": sub.plan.name if sub else "Free",
            "plan_slug": sub.plan.slug if sub else "free",
            "plan_status": sub.status if sub else "free",
        }
    }


@router.put("/profile")
def update_my_profile(
    body: schemas.UserUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Update the authenticated user's profile (name, notifications, etc.)."""
    if body.full_name is not None:
        current_user.full_name = body.full_name
    if body.email_notifications is not None:
        current_user.email_notifications = body.email_notifications
    if body.email is not None and body.email != current_user.email:
        # Check if email is taken
        if db.query(models.User).filter(models.User.email == body.email).first():
            raise HTTPException(status_code=400, detail="Email already in use")
        current_user.email = body.email
        current_user.is_verified = False  # Require re-verification
    db.commit()
    return {"success": True, "message": "Profile updated successfully"}


@router.post("/change-password")
def change_password(
    body: schemas.ChangePasswordRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Change the authenticated user's password."""
    if not current_user.password:
        raise HTTPException(status_code=400, detail="This account uses Google sign-in. No password to change.")
    if not verify_password(body.old_password, current_user.password):
        raise HTTPException(status_code=401, detail="Current password is incorrect")
    if len(body.new_password) < 8:
        raise HTTPException(status_code=400, detail="New password must be at least 8 characters")
    current_user.password = get_password_hash(body.new_password)
    db.commit()

    # Audit log
    audit = models.AuditLog(
        user_id=current_user.id,
        actor_email=current_user.email,
        event_type="PASSWORD_CHANGED",
        details="User changed their password",
    )
    db.add(audit)
    db.commit()
    return {"success": True, "message": "Password changed successfully"}


@router.delete("/account")
def delete_my_account(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Permanently delete the authenticated user's account."""
    if current_user.role in ("ADMIN", "VENDOR"):
        raise HTTPException(status_code=403, detail="Admin/Vendor accounts must be deleted by the super admin")

    # Log before deleting
    audit = models.AuditLog(
        user_id=None,
        actor_email=current_user.email,
        event_type="ACCOUNT_DELETED",
        details=f"User {current_user.email} (ID {current_user.id}) deleted their account",
    )
    db.add(audit)

    db.delete(current_user)
    db.commit()
    return {"success": True, "message": "Account deleted successfully"}


# ─────────────────────────────────────────────────────────────
# SESSION STATS
# ─────────────────────────────────────────────────────────────

@router.get("/stats")
def get_user_stats(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Return aggregated usage statistics for the current user."""
    task_count = db.query(models.Task).filter(models.Task.user_id == current_user.id).count()
    goal_count = db.query(models.Goal).filter(models.Goal.user_id == current_user.id).count()
    device_count = len(current_user.devices)
    plan_name = current_user.subscription.plan.name if current_user.subscription else "Free"
    return {
        "success": True,
        "stats": {
            "tasks": task_count,
            "goals": goal_count,
            "devices": device_count,
            "plan": plan_name,
            "is_premium": current_user.is_premium,
        }
    }


# ─────────────────────────────────────────────────────────────
# DEVICES
# ─────────────────────────────────────────────────────────────

@router.get("/devices")
def list_my_devices(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """List all hardware devices registered to this user."""
    return {
        "success": True,
        "devices": [
            {"mac_address": d.mac_address, "last_used": str(d.last_used), "trial_hits": d.trial_hits}
            for d in current_user.devices
        ],
    }


@router.delete("/devices/{mac_address}")
def remove_device(
    mac_address: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Remove a hardware device from the user's account."""
    device = db.query(models.Device).filter(
        models.Device.mac_address == mac_address,
        models.Device.user_id == current_user.id,
    ).first()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
    db.delete(device)
    db.commit()
    return {"success": True, "message": f"Device {mac_address} removed"}

@router.post("/me/reset-hardware")
def reset_my_hardware(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Clear all hardware footprints for the current user (S-User Recovery)."""
    # Optional: Implement a cooldown or limit for S-Users
    db.query(models.Device).filter(models.Device.user_id == current_user.id).delete()
    db.commit()
    
    audit = models.AuditLog(
        user_id=current_user.id, actor_email=current_user.email,
        event_type="HARDWARE_SELF_RESET",
        details="User cleared their own hardware footprints"
    )
    db.add(audit); db.commit()
    return {"success": True, "message": "All hardware footprints cleared. You can now log in from a new machine."}


# ─────────────────────────────────────────────────────────────
# NOTIFICATIONS
# ─────────────────────────────────────────────────────────────

@router.get("/notifications")
def get_notifications(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    notes = db.query(models.Notification).filter(
        models.Notification.user_id == current_user.id
    ).order_by(models.Notification.created_at.desc()).limit(50).all()
    return {
        "success": True,
        "notifications": [
            {"id": n.id, "title": n.title, "message": n.message, "is_read": n.is_read, "created_at": str(n.created_at)}
            for n in notes
        ],
    }


@router.post("/notifications/{notif_id}/read")
def mark_notification_read(
    notif_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    n = db.query(models.Notification).filter(models.Notification.id == notif_id, models.Notification.user_id == current_user.id).first()
    if not n:
        raise HTTPException(status_code=404, detail="Notification not found")
    n.is_read = True
    db.commit()
    return {"success": True}


@router.get("/public/dns-settings")
def get_public_dns_settings(db: Session = Depends(get_db)):
    from db_models import AppSetting
    
    ip_setting = db.query(AppSetting).filter(AppSetting.setting_key == "dns_ip").first()
    port_setting = db.query(AppSetting).filter(AppSetting.setting_key == "dns_port").first()
    domain_setting = db.query(AppSetting).filter(AppSetting.setting_key == "dns_domain").first()
    
    return {
        "dnsIP": ip_setting.setting_value if ip_setting else "127.0.0.1",
        "dnsPort": port_setting.setting_value if port_setting else "8000",
        "dnsDomain": domain_setting.setting_value if domain_setting else ""
    }

from pydantic import BaseModel
class RemoteControlEvent(BaseModel):
    type: str
    x: float = 0.0
    y: float = 0.0
    key: str = ""
    prompt: str = ""

@router.post("/remote-control")
async def handle_remote_control(event: RemoteControlEvent, db: Session = Depends(get_db)):
    try:
        import pyautogui
        pyautogui.FAILSAFE = True  # FIX: Re-enabled fail-safe so you can stop runaway scripts by moving mouse to a corner!
        
        if event.type == "screenshot_and_analyze":
            import base64
            from io import BytesIO
            import httpx
            import db_models as models
            
            # 1. Take Screenshot
            img = pyautogui.screenshot()
            
            # Compress and encode
            buffered = BytesIO()
            img.convert("RGB").save(buffered, format="JPEG", quality=50)
            img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
            
            prompt_text = event.prompt if event.prompt else "Analyze this screenshot and explain what is happening on the screen. Be concise."
            
            # 2. Check DB for Gemini or Groq
            answer = "Error: No valid API key found in Admin Dashboard."
            
            gemini_key = db.query(models.AiProviderKey).filter(models.AiProviderKey.provider == "gemini", models.AiProviderKey.is_enabled == True).first()
            groq_key = db.query(models.AiProviderKey).filter(models.AiProviderKey.provider == "groq", models.AiProviderKey.is_enabled == True).first()
            
            async with httpx.AsyncClient() as client:
                if gemini_key:
                    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={gemini_key.api_key_value}"
                    payload = {
                        "contents": [{
                            "parts": [
                                {"text": prompt_text},
                                {"inline_data": {"mime_type": "image/jpeg", "data": img_str}}
                            ]
                        }]
                    }
                    res = await client.post(url, json=payload, timeout=30.0)
                    if res.status_code == 200:
                        answer = res.json().get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "No answer")
                elif groq_key:
                    url = "https://api.groq.com/openai/v1/chat/completions"
                    headers = {"Authorization": f"Bearer {groq_key.api_key_value}"}
                    payload = {
                        "model": "llama-3.2-11b-vision-preview",
                        "messages": [{
                            "role": "user",
                            "content": [
                                {"type": "text", "text": prompt_text},
                                {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{img_str}"}}
                            ]
                        }],
                        "max_tokens": 500
                    }
                    res = await client.post(url, headers=headers, json=payload, timeout=30.0)
                    if res.status_code == 200:
                        answer = res.json().get("choices", [{}])[0].get("message", {}).get("content", "No answer")
                        
            return {"status": "success", "answer": answer}
            
        else:
            # Calculate absolute coordinates
            screen_width, screen_height = pyautogui.size()
            abs_x = int(event.x * screen_width)
            abs_y = int(event.y * screen_height)
            
            if event.type == "mousemove":
                # pyautogui.moveTo(abs_x, abs_y) # FIX: Temporarily disabled to prevent your mouse from being hijacked! Uncomment when ready.
                pass
            elif event.type == "mousedown":
                pyautogui.mouseDown(x=abs_x, y=abs_y)
            elif event.type == "mouseup":
                pyautogui.mouseUp(x=abs_x, y=abs_y)
            elif event.type == "click":
                pyautogui.click(x=abs_x, y=abs_y)
            elif event.type == "keydown":
                pyautogui.keyDown(event.key)
            elif event.type == "keyup":
                pyautogui.keyUp(event.key)
                
            return {"status": "success"}
    except Exception as e:
        import traceback
        print("Remote Control Error:", e)
        traceback.print_exc()
        return {"status": "error", "message": str(e)}

