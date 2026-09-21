from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from pydantic import BaseModel
import json
import os
import uuid

from services.api.core.database import get_db
from services.api.core.security import get_current_user
from services.api.models.user import User
from services.api.db_models.email_template import EmailTemplate

router = APIRouter(prefix="/admin-system", tags=["Admin Settings & Compliance"])

async def verify_admin(current_user: User = Depends(get_current_user)):
    from services.api.core.admin_config import get_admin_settings
    settings = get_admin_settings()
    
    # Allow if role is admin OR if their email matches the global admin email
    if current_user.role not in ("ADMIN", "SUPER_ADMIN") and current_user.email != settings.admin_email:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return current_user

from typing import Optional, Dict, Any
from services.api.db_models.email_template import EmailBranding, EmailLog

class EmailTemplateSchema(BaseModel):
    template_key: str
    name: str
    category: str = "CUSTOM"
    description: Optional[str] = None
    enabled: bool = True
    subject: str
    preheader: Optional[str] = None
    body_content: Optional[Dict[str, Any]] = None
    body_html: str
    plain_text_content: Optional[str] = None
    status: str = "Published"
    global_style_enabled: bool = True
    custom_style: Optional[Dict[str, Any]] = None

class EmailBrandingSchema(BaseModel):
    company_name: str
    website: str
    support_email: str
    from_name: str
    from_email: str
    logo_light: Optional[str] = None
    logo_dark: Optional[str] = None
    primary_color: str
    background_color: str
    card_background: str
    text_color: str
    muted_text_color: str
    border_color: str
    button_text: str
    footer_text: Optional[str] = None
    footer_links: Optional[Dict[str, Any]] = None

@router.get("/email-templates")
async def get_email_templates(db: AsyncSession = Depends(get_db), _: User = Depends(verify_admin)):
    res = await db.execute(select(EmailTemplate).order_by(EmailTemplate.id.desc()))
    return res.scalars().all()

@router.put("/email-templates/{template_key}")
async def update_email_template(template_key: str, template_data: EmailTemplateSchema, db: AsyncSession = Depends(get_db), _: User = Depends(verify_admin)):
    res = await db.execute(select(EmailTemplate).filter(EmailTemplate.template_key == template_key))
    template = res.scalars().first()
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    
    for key, value in template_data.dict(exclude_unset=True).items():
        setattr(template, key, value)
    
    await db.commit()
    return template

@router.post("/email-templates")
async def create_email_template(template_data: EmailTemplateSchema, db: AsyncSession = Depends(get_db), _: User = Depends(verify_admin)):
    res = await db.execute(select(EmailTemplate).filter(EmailTemplate.template_key == template_data.template_key))
    existing = res.scalars().first()
    if existing:
        raise HTTPException(status_code=400, detail="Template with this key already exists")
    
    template = EmailTemplate(**template_data.dict())
    db.add(template)
    await db.commit()
    return template

@router.get("/email-branding")
async def get_email_branding(db: AsyncSession = Depends(get_db), _: User = Depends(verify_admin)):
    res = await db.execute(select(EmailBranding).order_by(EmailBranding.id.desc()).limit(1))
    branding = res.scalars().first()
    if not branding:
        # Return default structure
        return EmailBrandingSchema(
            company_name="HideWin", website="https://hidwin.com", support_email="support@hidwin.com",
            from_name="HideWin", from_email="noreply@hidwin.com", primary_color="#0A6FB7",
            background_color="#F9FAFB", card_background="#FFFFFF", text_color="#1F2937",
            muted_text_color="#6B7280", border_color="#E5E7EB", button_text="#FFFFFF"
        )
    return branding

@router.put("/email-branding")
async def update_email_branding(branding_data: EmailBrandingSchema, db: AsyncSession = Depends(get_db), _: User = Depends(verify_admin)):
    res = await db.execute(select(EmailBranding).order_by(EmailBranding.id.desc()).limit(1))
    branding = res.scalars().first()
    
    if not branding:
        branding = EmailBranding(**branding_data.dict())
        db.add(branding)
    else:
        for key, value in branding_data.dict(exclude_unset=True).items():
            setattr(branding, key, value)
            
    await db.commit()
    return branding

from services.api.schemas.marketing_schema import CampaignDispatchRequest
from services.api.services.marketing_service import MarketingService

@router.post("/email-campaigns/dispatch")
async def dispatch_marketing_campaign(
    payload: CampaignDispatchRequest, 
    db: AsyncSession = Depends(get_db), 
    _: User = Depends(verify_admin)
):
    try:
        result = await MarketingService.dispatch_campaign(
            db, 
            payload.template_key, 
            payload.audience, 
            payload.custom_emails, 
            payload.variables_override
        )
        if not result["success"]:
            raise HTTPException(status_code=400, detail=result["message"])
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/email-analytics")
async def get_email_analytics(db: AsyncSession = Depends(get_db), _: User = Depends(verify_admin)):
    res = await db.execute(select(EmailLog.status))
    statuses = res.scalars().all()
    
    total = len(statuses)
    delivered = sum(1 for s in statuses if s in ("DELIVERED", "SENT"))
    failed = sum(1 for s in statuses if s == "FAILED")
    
    return {
        "total_attempted": total,
        "total_delivered": delivered,
        "total_failed": failed,
        "success_rate": f"{(delivered/total*100):.1f}%" if total > 0 else "0%"
    }

@router.post("/email-logs/{log_id}/retry")
async def retry_email_log(log_id: int, db: AsyncSession = Depends(get_db), _: User = Depends(verify_admin)):
    from services.api.services.email_service import EmailNotificationService
    
    res = await db.execute(select(EmailLog).filter(EmailLog.id == log_id))
    log = res.scalars().first()
    
    if not log:
        raise HTTPException(status_code=404, detail="Log not found")
        
    if "OTP" in log.template_key.upper():
        raise HTTPException(status_code=400, detail="Expired authentication email - cannot retry.")
        
    if log.status == "DELIVERED":
        raise HTTPException(status_code=400, detail="Email was already delivered successfully.")
        
    try:
        success = await EmailNotificationService.dispatch(
            db, 
            log.template_key, 
            log.recipient, 
            {"firstName": log.recipient.split('@')[0]}
        )
        return {"success": success, "message": "Retry successful" if success else "Retry failed again"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/email-logs")
async def get_email_logs(limit: int = 50, db: AsyncSession = Depends(get_db), _: User = Depends(verify_admin)):
    res = await db.execute(select(EmailLog).order_by(EmailLog.id.desc()).limit(limit))
    return res.scalars().all()

class AuditChunkUpload(BaseModel):
    session_id: str
    chunk_index: int
    encrypted_payload: str

@router.post("/compliance/audit-chunk")
async def upload_audit_chunk(chunk: AuditChunkUpload, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    audit_dir = os.path.join(os.path.dirname(__file__), "..", "..", "secure_audit_logs")
    os.makedirs(audit_dir, exist_ok=True)
    
    filename = f"{chunk.session_id}_chunk_{chunk.chunk_index}_{uuid.uuid4().hex[:4]}.json"
    filepath = os.path.join(audit_dir, filename)
    
    with open(filepath, "w") as f:
        json.dump({
            "user": current_user.email,
            "role": current_user.role,
            "timestamp": str(datetime.utcnow()),
            "payload": chunk.encrypted_payload
        }, f)
        
    return {"status": "uploaded"}
