from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from infrastructure.database.base import AuditableBase
from domain.entities.meeting import MeetingEntity, IMeetingRepository

class AsyncMeetingRepository(IMeetingRepository):
    def __init__(self, db: AsyncSession, reader_db: AsyncSession = None):
        self.db = db
        self.reader_db = reader_db or db
        
    async def get_by_id(self, meeting_id: str, host_id: str) -> Optional[MeetingEntity]:
        """
        Time Complexity: O(log N) - B-Tree index lookup on Primary Key
        Space Complexity: O(1)
        DB Operations: 1 Read
        """
        stmt = select(MeetingModel).where(
            MeetingModel.id == meeting_id,
            MeetingModel.host_id == host_id,
            MeetingModel.is_deleted == False
        )
        result = await self.reader_db.execute(stmt)
        record = result.scalar_one_or_none()
        
        if not record:
            return None
        return self._to_entity(record)
        
    async def get_active_meetings_paginated(self, host_id: str, limit: int = 50, offset: int = 0) -> List[MeetingEntity]:
        """
        Time Complexity: O(log N + L) where L is limit. Requires composite index on (host_id, status, is_deleted).
        Space Complexity: O(L)
        DB Operations: 1 Read
        """
        stmt = select(MeetingModel).where(
            MeetingModel.host_id == host_id,
            MeetingModel.status == "ACTIVE",
            MeetingModel.is_deleted == False
        ).limit(limit).offset(offset)
        
        result = await self.reader_db.execute(stmt)
        records = result.scalars().all()
        return [self._to_entity(r) for r in records]
        
    # Implementation of _to_entity omitted for brevity
