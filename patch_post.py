with open(r'C:\Users\akula\Downloads\Hide-WIN\hidewin-fastapi\src\api\admin\email_templates.py', 'r', encoding='utf-8') as f:
    content = f.read()

post_endpoint = """
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
"""
content = content + post_endpoint

with open(r'C:\Users\akula\Downloads\Hide-WIN\hidewin-fastapi\src\api\admin\email_templates.py', 'w', encoding='utf-8') as f:
    f.write(content)
print("Added POST endpoint")
