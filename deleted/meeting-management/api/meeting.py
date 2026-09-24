from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select, delete
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
import uuid

from services.api import db_models as models
from services.api.core.database import get_db
from services.api.core.security import get_current_user
from datetime import timedelta

router = APIRouter(prefix="/api/meetings", tags=["meetings"])

class MeetingCreate(BaseModel):
    title: str
    description: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    timezone: str = "UTC"
    recurrence: str = "none"

    class Config:
        extra = "forbid"

class MeetingResponse(BaseModel):
    id: str
    title: str
    description: Optional[str]
    start_time: Optional[datetime]
    end_time: Optional[datetime]
    timezone: str
    recurrence: str
    status: str
    created_at: datetime

    class Config:
        orm_mode = True

@router.post("/", response_model=List[MeetingResponse])
async def create_meeting(
    meeting: MeetingCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    base_id = 'HW-' + str(uuid.uuid4()).split('-')[0].upper() + '-' + str(uuid.uuid4()).split('-')[1].upper()

    # Resolve correct user ID from full db_models
    from services.api.db_models.user import User as FullUser
    full_user_res = await db.execute(select(FullUser).filter(FullUser.email == current_user.email))
    full_user = full_user_res.scalars().first()
    uid = full_user.id if full_user else current_user.id

    occurrences = 1
    if meeting.recurrence == "daily":
        occurrences = 5
    elif meeting.recurrence == "weekly":
        occurrences = 4

    created_meetings = []
    
    for i in range(occurrences):
        suffix = f"-{i}" if i > 0 else ""
        meeting_id = base_id + suffix
        
        start_time = meeting.start_time
        end_time = meeting.end_time
        if start_time and end_time:
            if meeting.recurrence == "daily":
                start_time = start_time + timedelta(days=i)
                end_time = end_time + timedelta(days=i)
            elif meeting.recurrence == "weekly":
                start_time = start_time + timedelta(weeks=i)
                end_time = end_time + timedelta(weeks=i)

        db_meeting = models.Meeting(
            id=meeting_id,
            host_id=uid,
            title=meeting.title,
            description=meeting.description,
            start_time=start_time,
            end_time=end_time,
            timezone=meeting.timezone,
            recurrence=meeting.recurrence if i == 0 else "none",
            status="SCHEDULED"
        )
        db.add(db_meeting)
        created_meetings.append(db_meeting)
        
    await db.commit()

    created_ids = [m.id for m in created_meetings]
    if created_ids:
        res = await db.execute(select(models.Meeting).filter(models.Meeting.id.in_(created_ids)))
        return res.scalars().all()
    
    return []


@router.get("/upcoming"
, response_model=List[MeetingResponse])
async def get_upcoming_meetings(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Resolve the correct ID from the full user model
    from services.api.db_models.user import User as FullUser
    full_user_res = await db.execute(select(FullUser).filter(FullUser.email == current_user.email))
    full_user = full_user_res.scalars().first()
    uid = full_user.id if full_user else current_user.id

    result = await db.execute(select(models.Meeting).filter(
        models.Meeting.host_id == uid,
        models.Meeting.status.in_(["SCHEDULED", "ACTIVE"])
    ).order_by(models.Meeting.created_at.desc()))
    meetings = result.scalars().all()
    return meetings

@router.get("/history", response_model=List[MeetingResponse])
async def get_historical_meetings(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    from services.api.db_models.user import User as FullUser
    full_user_res = await db.execute(select(FullUser).filter(FullUser.email == current_user.email))
    full_user = full_user_res.scalars().first()
    uid = full_user.id if full_user else current_user.id

    result = await db.execute(select(models.Meeting).filter(
        models.Meeting.host_id == uid,
        models.Meeting.status.in_(["COMPLETED", "CANCELLED"])
    ).order_by(models.Meeting.created_at.desc()))
    meetings = result.scalars().all()
    return meetings


@router.put("/{meeting_id}", response_model=MeetingResponse)
async def update_meeting(
    meeting_id: str,
    meeting_data: MeetingCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    from services.api.db_models.user import User as FullUser
    full_user_res = await db.execute(select(FullUser).filter(FullUser.email == current_user.email))
    full_user = full_user_res.scalars().first()
    uid = full_user.id if full_user else current_user.id

    result = await db.execute(select(models.Meeting).filter(
        models.Meeting.id == meeting_id,
        models.Meeting.host_id == uid
    ))
    meeting = result.scalars().first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
        
    meeting.title = meeting_data.title
    meeting.description = meeting_data.description
    if meeting_data.start_time:
        meeting.start_time = meeting_data.start_time
    if meeting_data.end_time:
        meeting.end_time = meeting_data.end_time
    meeting.timezone = meeting_data.timezone
    
    await db.commit()
    result = await db.execute(select(models.Meeting).filter(models.Meeting.id == meeting.id))
    return result.scalars().first()

@router.delete("/clear-all")
async def clear_all_meetings(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    from services.api.db_models.user import User as FullUser
    full_user_res = await db.execute(select(FullUser).filter(FullUser.email == current_user.email))
    full_user = full_user_res.scalars().first()
    uid = full_user.id if full_user else current_user.id

    await db.execute(delete(models.Meeting).filter(models.Meeting.host_id == uid))
    await db.commit()
    return {"status": "success"}

@router.delete("/{meeting_id}")
async def delete_meeting(meeting_id: str, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    from services.api.db_models.user import User as FullUser
    full_user_res = await db.execute(select(FullUser).filter(FullUser.email == current_user.email))
    full_user = full_user_res.scalars().first()
    uid = full_user.id if full_user else current_user.id

    result = await db.execute(select(models.Meeting).filter(
        models.Meeting.id == meeting_id,
        models.Meeting.host_id == uid
    ))
    meeting = result.scalars().first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
        
    await db.delete(meeting)
    await db.commit()
    return {"status": "success"}
