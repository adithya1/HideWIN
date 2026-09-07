from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from src.lib.database import get_db
import db_models as models
from src.api.user.auth import get_current_user
from pydantic import BaseModel

router = APIRouter(prefix="/integrations", tags=["Integrations"])

class IntegrationCreate(BaseModel):
    platform: str
    api_url: str
    access_token: str

@router.get("/")
def get_integrations(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """Retrieve all external API integrations tied to the user/vendor."""
    return db.query(models.Integration).filter(models.Integration.user_id == current_user.id).all()

@router.post("/")
def save_integration(inter: IntegrationCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """Save or update an API configuration (replaces existing token for platform)."""
    existing = db.query(models.Integration).filter(
        models.Integration.user_id == current_user.id,
        models.Integration.platform == inter.platform
    ).first()

    if existing:
        existing.api_url = inter.api_url
        existing.access_token = inter.access_token
    else:
        new_int = models.Integration(
            user_id=current_user.id,
            platform=inter.platform,
            api_url=inter.api_url,
            access_token=inter.access_token
        )
        db.add(new_int)
    
    db.commit()
    return {"message": f"{inter.platform} integration successfully linked."}
