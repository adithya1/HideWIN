from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime
from pydantic import BaseModel

from services.api.core.database import get_db
from services.api.core.security import get_current_user
from services.api.models.user import User
from services.api.db_models.workflow import WorkReport

router = APIRouter(prefix="/reports", tags=["Reports & Appraisals"])

class ManualStatusSync(BaseModel):
    timeframe: str

@router.post("/manual_sync")
async def trigger_manual_sync(payload: ManualStatusSync, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    mock_metric_graph = [12, 19, 3, 5, 2, 3] if payload.timeframe in ["MONTHLY", "YEARLY"] else [2, 1, 0, 4]
    
    report = WorkReport(
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
    await db.commit()
    return {"status": "synced", "report_id": report.id, "data": report.summary_data}

@router.get("/{timeframe}")
async def fetch_status_cards(timeframe: str, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    query = select(WorkReport).filter(WorkReport.report_type == timeframe.upper())
    
    if current_user.role == "VENDOR":
        query = query.filter(WorkReport.vendor_id == current_user.id)
    else:
        query = query.filter(WorkReport.user_id == current_user.id)
        
    query = query.order_by(WorkReport.generated_at.desc())
    res = await db.execute(query)
    return res.scalars().all()
