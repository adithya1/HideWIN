from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel

class MeetingEntity(BaseModel):
    id: str
    title: str
    host_id: str
    status: str
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    timezone: Optional[str] = "UTC"

class IMeetingRepository:
    def get_by_id(self, meeting_id: str, host_id: str) -> Optional[MeetingEntity]:
        raise NotImplementedError
        
    def save(self, meeting: MeetingEntity) -> MeetingEntity:
        raise NotImplementedError
