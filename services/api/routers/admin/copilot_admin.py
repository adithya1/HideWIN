from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from db_models.copilot import CopilotTemplate
from core.database import get_db

router = APIRouter()

@router.get("/templates")
def get_templates(db: Session = Depends(get_db)):
    """Admin: Get all copilot templates"""
    return db.query(CopilotTemplate).all()

@router.post("/templates")
def create_template(name: str, description: str = None, form_schema: dict = None, db: Session = Depends(get_db)):
    """Admin: Create a new copilot template dynamically"""
    tpl = CopilotTemplate(name=name, description=description, form_schema=form_schema or {})
    db.add(tpl)
    db.commit()
    db.refresh(tpl)
    return tpl

