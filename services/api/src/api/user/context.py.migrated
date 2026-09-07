from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from src.lib.database import get_db
import db_models as models
from src.api.user.auth import get_current_user

router = APIRouter(prefix="/context", tags=["Shadow IDE Context"])

class ShadowContextUpload(BaseModel):
    file_path: str
    active_ide_code: str

@router.post("/sync")
def sync_shadow_context(data: ShadowContextUpload, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """Continuously called by Desktop Electron client to inject active code view."""
    record = db.query(models.ShadowContext).filter(models.ShadowContext.user_id == current_user.id).first()
    if record:
        record.file_path = data.file_path
        record.active_ide_code = data.active_ide_code
    else:
        new_record = models.ShadowContext(
            user_id=current_user.id,
            file_path=data.file_path,
            active_ide_code=data.active_ide_code
        )
        db.add(new_record)
    
    db.commit()
    return {"status": "synced"}
