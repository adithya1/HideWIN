from typing import Optional
from sqlalchemy.orm import Session
from domain.entities.meeting import MeetingEntity, IMeetingRepository
from src.models import models

class SqlAlchemyMeetingRepository(IMeetingRepository):
    def __init__(self, db: Session):
        self.db = db
        
    def get_by_id(self, meeting_id: str, host_id: str) -> Optional[MeetingEntity]:
        db_meeting = self.db.query(models.Meeting).filter(
            models.Meeting.id == meeting_id,
            models.Meeting.host_id == host_id
        ).first()
        
        if not db_meeting:
            return None
            
        return MeetingEntity(
            id=db_meeting.id,
            title=db_meeting.title,
            host_id=db_meeting.host_id,
            status=db_meeting.status,
            start_time=db_meeting.start_time,
            end_time=db_meeting.end_time,
            timezone=db_meeting.timezone
        )
        
    def save(self, meeting: MeetingEntity) -> MeetingEntity:
        # Implementation omitted for scaffolding
        pass
