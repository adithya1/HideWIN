from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel

from src.lib.database import get_db
from db_models import EmailTemplate, User
from src.api.user.auth import get_current_user

router = APIRouter(prefix="/email-templates", tags=["Admin Email Templates"])

def verify_admin(current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
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

@router.get("/", response_model=List[EmailTemplateSchema])
def get_email_templates(db: Session = Depends(get_db), _: User = Depends(verify_admin)):
    return db.query(EmailTemplate).all()

@router.put("/{action_trigger}", response_model=EmailTemplateSchema)
def update_email_template(action_trigger: str, template_data: EmailTemplateUpdateSchema, db: Session = Depends(get_db), _: User = Depends(verify_admin)):
    template = db.query(EmailTemplate).filter(EmailTemplate.action_trigger == action_trigger).first()
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    
    template.title = template_data.title
    template.subject = template_data.subject
    template.body_html = template_data.body_html
    
    db.commit()
    db.refresh(template)
    return template

@router.post("/", response_model=EmailTemplateSchema)
def create_email_template(template_data: EmailTemplateSchema, db: Session = Depends(get_db), _: User = Depends(verify_admin)):
    existing = db.query(EmailTemplate).filter(EmailTemplate.action_trigger == template_data.action_trigger).first()
    if existing:
        raise HTTPException(status_code=400, detail="Template with this trigger already exists")
    
    template = EmailTemplate(
        action_trigger=template_data.action_trigger,
        title=template_data.title,
        subject=template_data.subject,
        body_html=template_data.body_html
    )
    db.add(template)
    db.commit()
    db.refresh(template)
    return template
