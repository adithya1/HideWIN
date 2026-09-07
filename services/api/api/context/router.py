from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from services.api.core.database import get_db
from services.api.db_models.session import ShadowContext
from services.api.core.security import get_current_user
from services.api.models.user import User

router = APIRouter(prefix="/context", tags=["Shadow IDE Context"])

class ShadowContextUpload(BaseModel):
    file_path: str
    active_ide_code: str

@router.post("/sync")
async def sync_shadow_context(
    data: ShadowContextUpload, 
    db: AsyncSession = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(ShadowContext).filter(ShadowContext.user_id == current_user.id))
    record = result.scalars().first()
    
    if record:
        record.file_path = data.file_path
        record.active_ide_code = data.active_ide_code
    else:
        new_record = ShadowContext(
            user_id=current_user.id,
            file_path=data.file_path,
            active_ide_code=data.active_ide_code
        )
        db.add(new_record)
    
    await db.commit()
    return {"status": "synced"}
