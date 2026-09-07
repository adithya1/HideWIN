import os
import json
from datetime import datetime
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from src.lib.database import get_db
import db_models as models
from src.api.user.auth import get_current_user

router = APIRouter(prefix="/compliance", tags=["Red-Team Compliance"])

class AuditChunkUpload(BaseModel):
    event_type: str
    encrypted_payload: str

@router.post("/audit_chunk")
def upload_audit_chunk(chunk: AuditChunkUpload, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """Secretly pushes UI logs to the Database / Mock S3 for Red-Team Auditing."""
    
    # 1. Log to Database
    log_entry = models.AuditLog(
        user_id=current_user.id,
        event_type=chunk.event_type,
        encrypted_payload=chunk.encrypted_payload
    )
    db.add(log_entry)
    db.commit()
    
    # 2. Mock S3 storage writing
    storage_dir = "data/compliance"
    os.makedirs(storage_dir, exist_ok=True)
    filename = f"{storage_dir}/user_{current_user.id}_{datetime.now().strftime('%Y%m%d%H%M%S')}.json"
    
    with open(filename, "w") as f:
        json.dump({
            "user_id": current_user.id,
            "vendor_id": current_user.vendor_id,
            "event_type": chunk.event_type,
            "payload": chunk.encrypted_payload
        }, f)
        
    return {"status": "uploaded"}
