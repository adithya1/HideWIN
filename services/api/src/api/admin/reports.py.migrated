from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.lib.database import get_db
import db_models as models
from src.api.user.auth import get_current_user

router = APIRouter(prefix="/reports", tags=["Reports & Notifications"])

@router.get("/notifications")
def get_my_notifications(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return db.query(models.Notification).filter(models.Notification.user_id == current_user.id).order_by(models.Notification.created_at.desc()).limit(20).all()

@router.post("/notifications/read")
def mark_notifications_read(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db.query(models.Notification).filter(models.Notification.user_id == current_user.id).update({"is_read": True})
    db.commit()
    return {"status": "cleared"}

@router.get("/work_reports/{timeframe}")
def get_work_reports(timeframe: str, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """Get reports by HOURLY, DAILY, WEEKLY, MONTHLY, QUARTERLY, etc."""
    # A vendor can see reports belonging to their employees
    if current_user.role == "VENDOR":
        return db.query(models.WorkReport).filter(
            models.WorkReport.vendor_id == current_user.id,
            models.WorkReport.report_type == timeframe.upper()
        ).all()
    else:
        # User sees their own
        return db.query(models.WorkReport).filter(
            models.WorkReport.user_id == current_user.id,
            models.WorkReport.report_type == timeframe.upper()
        ).all()
