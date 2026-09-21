import re

with open("services/api/api/admin/router.py", "r", encoding="utf-8") as f:
    text = f.read()

# Replace the EmailTemplateSchema and endpoints with the new ones
# Let's find where the email template section starts and ends.
start_idx = text.find("class EmailTemplateSchema")
end_idx = text.find("class AuditChunkUpload")

if start_idx != -1 and end_idx != -1:
    new_endpoints = """from typing import Optional, Dict, Any
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

@router.get("/email-logs")
async def get_email_logs(limit: int = 50, db: AsyncSession = Depends(get_db), _: User = Depends(verify_admin)):
    res = await db.execute(select(EmailLog).order_by(EmailLog.id.desc()).limit(limit))
    return res.scalars().all()

"""
    new_text = text[:start_idx] + new_endpoints + text[end_idx:]
    with open("services/api/api/admin/router.py", "w", encoding="utf-8") as f:
        f.write(new_text)
    print("Replaced email routes.")
else:
    print("Could not find start or end index.")
