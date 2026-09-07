from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel

from services.api.core.database import get_db
from services.api.core.security import get_current_user
from services.api.models.user import User
from services.api.db_models.user import Integration

router = APIRouter(prefix="/integrations", tags=["Integrations"])

class IntegrationCreate(BaseModel):
    platform: str
    api_url: str
    access_token: str

@router.get("/")
async def get_integrations(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    res = await db.execute(select(Integration).filter(Integration.user_id == current_user.id))
    return res.scalars().all()

@router.post("/")
async def save_integration(inter: IntegrationCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    res = await db.execute(select(Integration).filter(
        Integration.user_id == current_user.id,
        Integration.platform == inter.platform
    ))
    existing = res.scalars().first()

    if existing:
        existing.api_url = inter.api_url
        existing.access_token = inter.access_token
    else:
        new_int = Integration(
            user_id=current_user.id,
            platform=inter.platform,
            api_url=inter.api_url,
            access_token=inter.access_token
        )
        db.add(new_int)
    
    await db.commit()
    return {"message": f"{inter.platform} integration successfully linked."}
