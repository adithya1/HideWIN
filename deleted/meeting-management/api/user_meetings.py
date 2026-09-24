
from services.api.services.calendar_google_service import GoogleCalendarService
from services.api.services.calendar_outlook_service import OutlookCalendarService
import asyncio

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from pydantic import BaseModel
from typing import Optional
import uuid
import datetime

from ..core.database import get_db
from ..core.security import get_current_user
from ..db_models.user import User
from ..db_models.meeting import Meeting

router = APIRouter(prefix="/user/meetings", tags=["user_meetings"])

class MeetingCreate(BaseModel):
    title: str
    description: Optional[str] = None
    start_time: datetime.datetime
    end_time: datetime.datetime
    timezone: str = "UTC"

    class Config:
        extra = "forbid"

class MeetingUpdate(BaseModel):
    start_time: datetime.datetime
    end_time: datetime.datetime
    timezone: str = "UTC"

    class Config:
        extra = "forbid"

@router.post("")
async def create_meeting(meeting: MeetingCreate, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    meeting_id = f"HW-{uuid.uuid4().hex[:8].upper()}"
    
    # Resolve correct user ID from full db_models
    from services.api.db_models.user import User as FullUser
    from sqlalchemy.future import select as sa_select
    full_user_res = await db.execute(sa_select(FullUser).filter(FullUser.email == current_user.email))
    full_user = full_user_res.scalars().first()
    uid = full_user.id if full_user else current_user.id

    new_meeting = Meeting(
        id=meeting_id,
        host_id=uid,
        title=meeting.title,
        description=meeting.description,
        start_time=meeting.start_time,
        end_time=meeting.end_time,
        timezone=meeting.timezone,
        status="SCHEDULED"
    )
    db.add(new_meeting)
    await db.flush()
    
    if current_user.sync_google_calendar and current_user.google_access_token:
        asyncio.create_task(GoogleCalendarService.create_event(current_user, new_meeting, db))
    if current_user.sync_outlook_calendar and current_user.outlook_access_token:
        asyncio.create_task(OutlookCalendarService.create_event(current_user, new_meeting, db))
        
    await db.commit()
    return {"id": meeting_id, "message": "Meeting created"}

@router.get("")
async def get_meetings(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    # Resolve the full user from db_models to get the correct DB id
    from services.api.db_models.user import User as FullUser
    from sqlalchemy.future import select as sa_select
    full_user_res = await db.execute(sa_select(FullUser).filter(FullUser.email == current_user.email))
    full_user = full_user_res.scalars().first()
    uid = full_user.id if full_user else current_user.id

    res = await db.execute(
        select(Meeting)
        .where(Meeting.host_id == uid)
        .order_by(Meeting.start_time.desc())
    )
    meetings = res.scalars().all()
    
    return {"meetings": [
        {
            "id": m.id,
            "title": m.title,
            "start_time": m.start_time,
            "end_time": m.end_time,
            "timezone": m.timezone,
            "status": m.status
        }
        for m in meetings
    ]}

@router.put("/{meeting_id}")
async def update_meeting(meeting_id: str, updates: MeetingUpdate, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Meeting).where(Meeting.id == meeting_id, Meeting.host_id == current_user.id))
    meeting = res.scalars().first()
    
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
        
    meeting.start_time = updates.start_time
    meeting.end_time = updates.end_time
    meeting.timezone = updates.timezone
    
    if current_user.sync_google_calendar and current_user.google_access_token and meeting.google_event_id:
        asyncio.create_task(GoogleCalendarService.update_event(current_user, meeting, db))
    if current_user.sync_outlook_calendar and current_user.outlook_access_token and meeting.outlook_event_id:
        asyncio.create_task(OutlookCalendarService.update_event(current_user, meeting, db))
    
    await db.commit()
    return {"message": "Meeting updated"}

# Public Route for Join Landing Page
public_router = APIRouter(prefix="/public/meetings", tags=["public_meetings"])

@public_router.get("/{meeting_id}")
async def get_public_meeting(meeting_id: str, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Meeting).options(selectinload(Meeting.host)).where(Meeting.id == meeting_id))
    meeting = res.scalars().first()
    
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
        
    return {
        "id": meeting.id,
        "title": meeting.title,
        "start_time": meeting.start_time,
        "host_name": meeting.host.full_name or meeting.host.email if meeting.host else "HideWin User"
    }

@router.delete("/{meeting_id}")
async def delete_meeting(meeting_id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Meeting).where(Meeting.id == meeting_id, Meeting.host_id == current_user.id))
    meeting = res.scalars().first()
    
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
        
    # Dispatch deletions to connected calendars if needed
    # if current_user.sync_google_calendar ... GoogleCalendarService.delete_event(...)
    
    await db.delete(meeting)
    await db.commit()
    return {"status": "success"}
