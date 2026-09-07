from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from services.api.core.database import get_db
from services.api.core.security import get_current_user
from services.api.models.user import User
from services.api.api.calendar.service import CalendarService

router = APIRouter(prefix="/calendar", tags=["calendar"])

@router.get("/events")
async def get_events():
    return await CalendarService.get_events()

@router.post("/sync")
async def sync_calendar(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await CalendarService.sync_calendar(current_user, db)

@router.post("/invite/{meeting_id}")
async def invite_to_meeting(
    meeting_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await CalendarService.invite_to_meeting(meeting_id, current_user, db)
