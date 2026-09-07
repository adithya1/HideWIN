from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict
import uuid
import db_models as models
import src.schemas.schemas as schemas
from src.lib.database import get_db
from src.api.user.auth import get_current_user

router = APIRouter(prefix="/api/calendar", tags=["calendar"])

@router.get("/events")
def get_events():
    return {
        "success": True,
        "meetings": [
            {
                "id": "cal_123",
                "title": "Senior AI Interview - Candidate X",
                "start": "2026-04-06T12:00:00Z",
                "end": "2026-04-06T13:00:00Z",
                "participants": ["interviewer@company.com"],
                "stealth_ready": True
            },
            {
                "id": "cal_456",
                "title": "Strategic Planning - Q2",
                "start": "2026-04-06T15:00:00Z",
                "end": "2026-04-06T16:00:00Z",
                "participants": ["ceo@company.com"],
                "stealth_ready": False
            }
        ]
    }

@router.post("/sync")
async def sync_calendar(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Orchestrates the Stealth Sync (Roadmap 2.1).
    Fetches meetings and auto-prepares missions for detected interview keywords.
    """
    # 1. Simulate fetching from Google (Mocked for E2E)
    raw_events = [
        {"id": "ext_999", "summary": "Frontend Architect Interview", "start": "2026-04-06T10:00:00Z"},
        {"id": "ext_888", "summary": "Coffee with Boss", "start": "2026-04-06T14:00:00Z"}
    ]
    
    prepared_count = 0
    for event in raw_events:
        # 2. Check for keywords
        if "Interview" in event["summary"] or "Technical" in event["summary"]:
            # 3. Auto-Create Session
            session_id = f"auto_{event['id']}"
            existing = db.query(models.Session).filter(models.Session.id == session_id).first()
            if not existing:
                new_session = models.Session(
                    id=session_id,
                    user_id=current_user.id,
                    title=f"MISSION: {event['summary']}",
                    status="READY"
                )
                db.add(new_session)
                prepared_count += 1
    
    db.commit()
    return {
        "success": True,
        "missions_prepared": prepared_count,
        "status": "Stealth Sync Active — Check your Mission Hub."
    }

@router.post("/invite/{meeting_id}")
async def invite_to_meeting(
    meeting_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Generates a unique Stealth Session for an upcoming meeting and returns a 'Stealth Join' link.
    This link allows invited human advisors to join the stealth overlay live.
    """
    # 1. Create a new HideWIN Session
    session_id = str(uuid.uuid4())
    new_session = models.Session(
        id=session_id,
        user_id=current_user.id,
        title=f"Stealth Meeting: {meeting_id}",
        status="ACTIVE"
    )
    db.add(new_session)
    
    # 2. Add the current user as the LEAD participant
    lead = models.SessionParticipant(
        session_id=session_id,
        user_id=current_user.id,
        role="LEAD"
    )
    db.add(lead)
    
    db.commit()
    
    join_link = f"http://localhost:8000/advisor/join?session={session_id}"
    
    return {
        "success": True,
        "session_id": session_id,
        "join_link": join_link,
        "instructions": "Send this link to your trusted advisor(s). They will see your live transcript and provide manual advice."
    }
