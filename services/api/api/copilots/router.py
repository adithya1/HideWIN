from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

from services.api.core.database import get_db
from services.api.core.security import get_current_user
from services.api.db_models.copilot import CopilotTemplate, Assistant
from services.api.models.user import User
from services.api.api.admin.router import verify_admin

admin_router = APIRouter(prefix="/admin/copilots", tags=["Admin Copilots"])
user_router = APIRouter(prefix="/user/assistants", tags=["User Assistants"])

# --- SCHEMAS ---
class CopilotTemplateCreate(BaseModel):
    name: str
    description: Optional[str] = None
    icon: Optional[str] = None
    form_schema: Dict[str, Any] = {}

class CopilotTemplateOut(CopilotTemplateCreate):
    id: int
    is_active: bool
    class Config:
        orm_mode = True

class AssistantCreate(BaseModel):
    template_id: int
    name: str
    target_role: Optional[str] = None
    experience_years: Optional[int] = None
    resume_url: Optional[str] = None
    job_description_url: Optional[str] = None
    materials_url: Optional[str] = None

class AssistantOut(AssistantCreate):
    id: int
    class Config:
        orm_mode = True

# --- ADMIN ENDPOINTS ---
@admin_router.get("/templates", response_model=List[CopilotTemplateOut])
async def admin_get_templates(db: AsyncSession = Depends(get_db), _: User = Depends(verify_admin)):
    """Admin endpoint to retrieve all Copilot Templates."""
    result = await db.execute(select(CopilotTemplate))
    return result.scalars().all()

@admin_router.post("/templates", response_model=CopilotTemplateOut)
async def admin_create_template(template: CopilotTemplateCreate, db: AsyncSession = Depends(get_db), _: User = Depends(verify_admin)):
    """Admin endpoint to create a new dynamic Copilot Template."""
    db_template = CopilotTemplate(**template.dict())
    db.add(db_template)
    await db.commit()
    await db.refresh(db_template)
    return db_template

# --- USER ENDPOINTS ---
@user_router.get("/templates", response_model=List[CopilotTemplateOut])
async def user_get_active_templates(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    """User endpoint to fetch active Copilot Templates for the Launch Now dashboard."""
    result = await db.execute(select(CopilotTemplate).filter(CopilotTemplate.is_active == True))
    return result.scalars().all()

@user_router.get("/", response_model=List[AssistantOut])
async def user_get_assistants(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    """User endpoint to list their customized assistants."""
    result = await db.execute(select(Assistant).filter(Assistant.user_id == current_user.id))
    return result.scalars().all()

@user_router.post("/", response_model=AssistantOut)
async def user_create_assistant(assistant: AssistantCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    """User endpoint to create an assistant configured from a template."""
    db_assistant = Assistant(**assistant.dict(), user_id=current_user.id)
    db.add(db_assistant)
    await db.commit()
    await db.refresh(db_assistant)
    return db_assistant

