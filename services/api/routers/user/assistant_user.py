from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db_models.copilot import CopilotTemplate, Assistant
from core.database import get_db

router = APIRouter()

@router.get("/templates")
def get_active_templates(db: Session = Depends(get_db)):
    """User: Get active copilot templates to show in Launch Now dashboard."""
    return db.query(CopilotTemplate).filter(CopilotTemplate.is_active == True).all()

@router.get("/assistants")
def get_user_assistants(user_id: int = 1, db: Session = Depends(get_db)):
    """User: Get list of created assistants. (Hardcoded user_id for now)"""
    return db.query(Assistant).filter(Assistant.user_id == user_id).all()

@router.post("/assistants")
def create_assistant(template_id: int, name: str, target_role: str = None, experience_years: int = None, db: Session = Depends(get_db)):
    """User: Create a new assistant from a template."""
    assistant = Assistant(
        user_id=1, # Hardcoded temporarily
        template_id=template_id,
        name=name,
        target_role=target_role,
        experience_years=experience_years
    )
    db.add(assistant)
    db.commit()
    db.refresh(assistant)
    return assistant

