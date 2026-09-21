from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean, JSON
from sqlalchemy.sql import func
from .base import Base

class EmailTemplate(Base):
    __tablename__ = "email_templates"
    id = Column(Integer, primary_key=True, index=True)
    template_key = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    category = Column(String, default="CUSTOM")
    enabled = Column(Boolean, default=True)
    
    subject = Column(String, nullable=False)
    preheader = Column(String, nullable=True)
    body_content = Column(JSON, nullable=True)  # Store structured blocks for the visual editor
    body_html = Column(Text, nullable=False)
    plain_text_content = Column(Text, nullable=True)
    
    status = Column(String, default="Published") # Draft, Published
    version = Column(Integer, default=1)
    
    global_style_enabled = Column(Boolean, default=True)
    custom_style = Column(JSON, nullable=True) # Custom colors/spacing if global is off
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    created_by = Column(String, nullable=True)
    updated_by = Column(String, nullable=True)

class EmailBranding(Base):
    __tablename__ = "email_branding"
    id = Column(Integer, primary_key=True, index=True)
    
    company_name = Column(String, default="HideWin")
    website = Column(String, default="https://hidwin.com")
    support_email = Column(String, default="support@hidwin.com")
    from_name = Column(String, default="HideWin")
    from_email = Column(String, default="noreply@hidwin.com")
    reply_to = Column(String, nullable=True)
    
    logo_light = Column(String, nullable=True)
    logo_dark = Column(String, nullable=True)
    
    primary_color = Column(String, default="#0A6FB7")
    background_color = Column(String, default="#F9FAFB")
    card_background = Column(String, default="#FFFFFF")
    text_color = Column(String, default="#1F2937")
    muted_text_color = Column(String, default="#6B7280")
    border_color = Column(String, default="#E5E7EB")
    code_background = Column(String, default="#F3F4F6")
    button_text = Column(String, default="#FFFFFF")
    
    footer_text = Column(String, nullable=True)
    footer_links = Column(JSON, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class EmailLog(Base):
    __tablename__ = "email_logs"
    id = Column(Integer, primary_key=True, index=True)
    template_key = Column(String, index=True, nullable=True)
    recipient = Column(String, index=True, nullable=False)
    subject = Column(String, nullable=True)
    status = Column(String, default="QUEUED") # QUEUED, SENDING, SENT, DELIVERED, FAILED
    
    provider_message_id = Column(String, nullable=True)
    attempt_count = Column(Integer, default=0)
    failure_reason = Column(Text, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    sent_at = Column(DateTime(timezone=True), nullable=True)
    delivered_at = Column(DateTime(timezone=True), nullable=True)
