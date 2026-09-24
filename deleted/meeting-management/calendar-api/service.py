from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from services.api.db_models.session import Session
from services.api.models.user import User

class CalendarService:
    @staticmethod
    async def get_events():
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

    @staticmethod
    async def sync_calendar(current_user: User, db: AsyncSession):
        raw_events = [
            {"id": "ext_999", "summary": "Frontend Architect Interview", "start": "2026-04-06T10:00:00Z"},
            {"id": "ext_888", "summary": "Coffee with Boss", "start": "2026-04-06T14:00:00Z"}
        ]
        
        prepared_count = 0
        for event in raw_events:
            if "Interview" in event["summary"] or "Technical" in event["summary"]:
                session_id = f"auto_{event['id']}"
                result = await db.execute(select(Session).filter(Session.id == session_id))
                existing = result.scalars().first()
                if not existing:
                    new_session = Session(
                        id=session_id,
                        user_id=current_user.id,
                        title=f"MISSION: {event['summary']}",
                        status="READY"
                    )
                    db.add(new_session)
                    prepared_count += 1
        
        await db.commit()
        return {
            "success": True,
            "missions_prepared": prepared_count,
            "status": "Stealth Sync Active. Check your Mission Hub."
        }
