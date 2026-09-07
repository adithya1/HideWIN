from typing import Optional
from domain.entities.meeting import MeetingEntity, IMeetingRepository
from domain.exceptions.base import NotFoundException

class MeetingUseCase:
    def __init__(self, meeting_repo: IMeetingRepository):
        self.meeting_repo = meeting_repo
        
    def get_meeting(self, meeting_id: str, host_id: str) -> MeetingEntity:
        meeting = self.meeting_repo.get_by_id(meeting_id, host_id)
        if not meeting:
            raise NotFoundException("Meeting not found")
        return meeting
