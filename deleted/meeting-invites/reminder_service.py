import asyncio
from datetime import datetime, timezone, timedelta
from sqlalchemy import select, and_
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from services.api.core.database import async_session
from services.api.db_models.meeting import Meeting, MeetingParticipant, MeetingReminderLog
from services.api.services.email_service import EmailNotificationService
from services.api.core.config import settings

class ReminderService:
    @staticmethod
    async def process_reminders():
        """
        Background task to process upcoming meeting reminders.
        Should run frequently (e.g., every 5 minutes).
        """
        now = datetime.now(timezone.utc)
        
        # Define reminder intervals
        intervals = [
            ("24h", timedelta(hours=24)),
            ("1h", timedelta(hours=1)),
            ("10m", timedelta(minutes=10))
        ]
        
        async with async_session() as db:
            for reminder_type, offset in intervals:
                # We look for meetings starting exactly at (now + offset), +/- 5 minutes
                # to catch any that were missed or are coming up soon.
                target_start = now + offset - timedelta(minutes=6)
                target_end = now + offset + timedelta(minutes=6)
                
                query = select(Meeting).options(selectinload(Meeting.participants)).filter(
                    and_(
                        Meeting.status.in_(["SCHEDULED", "ACTIVE"]),
                        Meeting.start_time >= target_start,
                        Meeting.start_time <= target_end
                    )
                )
                
                result = await db.execute(query)
                meetings = result.scalars().all()
                
                for meeting in meetings:
                    template_key = "MEETING_STARTING_SOON" if reminder_type == "10m" else "MEETING_REMINDER"
                    
                    for p in meeting.participants:
                        # Idempotency check: did we already send this reminder type to this recipient?
                        log_query = select(MeetingReminderLog).filter_by(
                            meeting_id=meeting.id, 
                            recipient_email=p.email, 
                            reminder_type=reminder_type
                        )
                        log_res = await db.execute(log_query)
                        existing_log = log_res.scalars().first()
                        
                        if not existing_log:
                            # Prepare variables
                            variables = {
                                "firstName": p.email.split("@")[0],
                                "meetingTitle": meeting.title,
                                "meetingDate": meeting.start_time.strftime('%Y-%m-%d') if meeting.start_time else "",
                                "meetingTime": meeting.start_time.strftime('%H:%M') if meeting.start_time else "",
                                "meetingTimezone": meeting.timezone or "",
                                "meetingId": meeting.id,
                                "meetingRelativeTime": "in 24 hours" if reminder_type == "24h" else "in 1 hour",
                                "meetingMinutesUntilStart": "10",
                                # Assume an environment variable or standard URL builder in prod
                                "meetingJoinUrl": f"{settings.WEB_BASE_URL.rstrip('/')}/join/{meeting.id}"
                            }
                            
                            try:
                                # Dispatch template
                                await EmailNotificationService.dispatch(db, template_key, p.email, variables)
                                
                                # Log to prevent duplicates
                                new_log = MeetingReminderLog(
                                    meeting_id=meeting.id,
                                    recipient_email=p.email,
                                    reminder_type=reminder_type
                                )
                                db.add(new_log)
                                await db.commit()
                                print(f"[Reminders] Sent {reminder_type} reminder for {meeting.id} to {p.email}")
                            except Exception as e:
                                print(f"[Reminders] Error for {meeting.id} to {p.email}: {e}")
                                await db.rollback()
