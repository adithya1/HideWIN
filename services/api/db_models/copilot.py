from sqlalchemy import Column, Integer, String, Boolean, JSON, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from .base import Base

class CopilotTemplate(Base):
    """
    Admin-configured templates for Copilots.
    E.g. "Interview", "Trivia & Quiz", "Custom".
    """
    __tablename__ = "copilot_templates"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String, nullable=True)
    icon = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    
    # JSON schema defining what fields this template requires
    form_schema = Column(JSON, default=dict)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    assistants = relationship("Assistant", back_populates="template")

class Assistant(Base):
    """
    User-created Assistants linked to a template.
    """
    __tablename__ = "assistants"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    template_id = Column(Integer, ForeignKey("copilot_templates.id"))
    
    name = Column(String, index=True)
    
    target_role = Column(String, nullable=True)
    experience_years = Column(Integer, nullable=True)
    resume_url = Column(String, nullable=True)
    job_description_url = Column(String, nullable=True)
    materials_url = Column(String, nullable=True)
    
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    template = relationship("CopilotTemplate", back_populates="assistants")
    user = relationship("User")

