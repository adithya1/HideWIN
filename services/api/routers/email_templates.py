from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from services.api.core.database import get_db
from services.api.db_models.email_template import EmailTemplate
from pydantic import BaseModel
from typing import List, Optional, Any

router = APIRouter(prefix="/admin-system", tags=["Admin System"])

class EmailTemplateUpdate(BaseModel):
    name: Optional[str] = None
    subject: Optional[str] = None
    body_html: Optional[str] = None
    status: Optional[str] = None

@router.get("/email-templates")
async def get_email_templates(db: Session = Depends(get_db)):
    from sqlalchemy.future import select
    res = await db.execute(select(EmailTemplate).order_by(EmailTemplate.id))
    templates = res.scalars().all()
    # If empty, inject the default AUTH_LOGIN_OTP one since it's probably missing from the DB!
    if not templates:
        t = EmailTemplate(
            template_key="AUTH_LOGIN_OTP",
            name="Login OTP Code",
            subject="Your HideWin login code is {{otpCode}}",
            body_html="<p>Hi {{firstName}},</p><p>Your login code is: <strong>{{otpCode}}</strong></p><p>It expires in {{otpExpiryMinutes}} minutes.</p>",
            enabled=True,
            status="Published"
        )
        db.add(t)
        await db.commit()
        res = await db.execute(select(EmailTemplate).order_by(EmailTemplate.id))
        templates = res.scalars().all()

    # Convert to dicts for JSON response
    return [{
        "id": t.id,
        "template_key": t.template_key,
        "name": t.name,
        "description": t.description,
        "category": t.category,
        "enabled": t.enabled,
        "subject": t.subject,
        "body_html": t.body_html,
        "status": t.status,
        "updated_at": t.updated_at
    } for t in templates]

@router.put("/email-templates/{key}")
async def update_email_template(key: str, data: EmailTemplateUpdate, db: Session = Depends(get_db)):
    from sqlalchemy.future import select
    res = await db.execute(select(EmailTemplate).where(EmailTemplate.template_key == key))
    t = res.scalars().first()
    if not t:
        raise HTTPException(status_code=404, detail="Template not found")
    
    if data.name is not None: t.name = data.name
    if data.subject is not None: t.subject = data.subject
    if data.body_html is not None: t.body_html = data.body_html
    if data.status is not None: t.status = data.status
    
    await db.commit()
    return {"status": "success"}
