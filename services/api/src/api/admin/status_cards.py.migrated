import json
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.lib.database import get_db
import db_models as models
from src.api.user.auth import get_current_user
from pydantic import BaseModel

router = APIRouter(prefix="/status_cards", tags=["Appraisal Status Cards"])

class ManualStatusSync(BaseModel):
    timeframe: str # "24H", "SPRINT", "MONTHLY", "3_MONTHS", "6_MONTHS", "YEARLY"

@router.post("/manual_sync")
def trigger_manual_sync(payload: ManualStatusSync, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """
    Called by User/Vendor when clicking "Manual Sync Status".
    It forces an immediate extraction from JIRA/Git instead of waiting for the Hourly Agent,
    generating a fresh Graphical Data payload for the UI Appraisal Card.
    """
    # Mocking the AI aggregation logic for a specific timeframe
    mock_metric_graph = [12, 19, 3, 5, 2, 3] if payload.timeframe in ["MONTHLY", "YEARLY"] else [2, 1, 0, 4]
    
    report = models.WorkReport(
        user_id=current_user.id,
        vendor_id=current_user.vendor_id,
        report_type=payload.timeframe,
        summary_data={
            "title": f"Manual Status Sync: {payload.timeframe}",
            "metrics": mock_metric_graph,
            "key_achievements": ["Closed 14 Tickets", "Zero Critical Bugs in Prod", "Led Architecture Review"],
            "shareable_link": f"https://hidewin.app/appraisals/{current_user.id}/{datetime.now().timestamp()}"
        }
    )
    db.add(report)
    db.commit()
    
    return {"status": "synced", "report_id": report.id, "data": report.summary_data}

@router.get("/get_cards/{timeframe}")
def fetch_status_cards(timeframe: str, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """Fetches all graphical cards generated. Vendors see org, Users see own."""
    query = db.query(models.WorkReport).filter(models.WorkReport.report_type == timeframe)
    
    if current_user.role == "VENDOR":
        query = query.filter(models.WorkReport.vendor_id == current_user.id)
    elif current_user.role == "USER":
        query = query.filter(models.WorkReport.user_id == current_user.id)
        
    return query.order_by(models.WorkReport.generated_at.desc()).all()
