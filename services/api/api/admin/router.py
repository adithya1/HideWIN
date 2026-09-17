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

class EmailTemplateSchema(BaseModel):
    action_trigger: str
    title: str
    subject: str
    body_html: str
    
class EmailTemplateUpdateSchema(BaseModel):
    title: str
    subject: str
    body_html: str

@router.get("/email-templates")
async def get_email_templates(db: AsyncSession = Depends(get_db), _: User = Depends(verify_admin)):
    res = await db.execute(select(EmailTemplate))
    return res.scalars().all()

@router.put("/email-templates/{action_trigger}")
async def update_email_template(action_trigger: str, template_data: EmailTemplateUpdateSchema, db: AsyncSession = Depends(get_db), _: User = Depends(verify_admin)):
    res = await db.execute(select(EmailTemplate).filter(EmailTemplate.action_trigger == action_trigger))
    template = res.scalars().first()
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    
    template.title = template_data.title
    template.subject = template_data.subject
    template.body_html = template_data.body_html
    await db.commit()
    return template

@router.post("/email-templates")
async def create_email_template(template_data: EmailTemplateSchema, db: AsyncSession = Depends(get_db), _: User = Depends(verify_admin)):
    res = await db.execute(select(EmailTemplate).filter(EmailTemplate.action_trigger == template_data.action_trigger))
    existing = res.scalars().first()
    if existing:
        raise HTTPException(status_code=400, detail="Template with this trigger already exists")
    
    template = EmailTemplate(
        action_trigger=template_data.action_trigger,
        title=template_data.title,
        subject=template_data.subject,
        body_html=template_data.body_html
    )
    db.add(template)
    await db.commit()
    return template

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
