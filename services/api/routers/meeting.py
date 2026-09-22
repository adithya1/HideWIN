from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form
from sqlalchemy.orm import Session
from sqlalchemy import select, delete
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
import uuid

from services.api import db_models as models
from services.api.core.database import get_db
from services.api.core.security import get_current_user
from services.api.services.email_service import EmailService, EmailNotificationService
from datetime import timedelta

router = APIRouter(prefix="/api/meetings", tags=["meetings"])

class MeetingCreate(BaseModel):
    title: str
    description: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    timezone: str = "UTC"
    recurrence: str = "none"
    participants: List[str] = []
    cc_participants: List[str] = []
    bcc_participants: List[str] = []
    invite_url_base: Optional[str] = None

class MeetingParticipantResponse(BaseModel):
    email: str
    role: str

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
    participants: List[MeetingParticipantResponse]

    class Config:
        orm_mode = True

@router.post("/", response_model=List[MeetingResponse])
async def create_meeting(
    meeting_data: str = Form(...),
    files: List[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    import json
    meeting = MeetingCreate(**json.loads(meeting_data))
    base_id = 'HW-' + str(uuid.uuid4()).split('-')[0].upper() + '-' + str(uuid.uuid4()).split('-')[1].upper()
    passcode = base_id.split('-')[-1].lower()

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
        for email in meeting.participants:
            db_participant = models.MeetingParticipant(meeting_id=meeting_id, email=email, role="guest", recipient_type="to")
            db.add(db_participant)
        for email in meeting.cc_participants:
            db_participant = models.MeetingParticipant(meeting_id=meeting_id, email=email, role="guest", recipient_type="cc")
            db.add(db_participant)
        for email in meeting.bcc_participants:
            db_participant = models.MeetingParticipant(meeting_id=meeting_id, email=email, role="guest", recipient_type="bcc")
            db.add(db_participant)
            
        if files:
            import os
            os.makedirs("attachments", exist_ok=True)
            for file in files:
                file_path = f"attachments/{meeting_id}_{file.filename}"
                with open(file_path, "wb") as buffer:
                    buffer.write(file.file.read())
                    file.file.seek(0) # Reset pointer for email dispatch
                db_att = models.MeetingAttachment(meeting_id=meeting_id, filename=file.filename, content_type=file.content_type or "application/octet-stream", file_path=file_path)
                db.add(db_att)

            
        created_meetings.append(db_meeting)
        
    await db.commit()

    if (meeting.participants or meeting.cc_participants or meeting.bcc_participants) and meeting.invite_url_base:
        # Prepare attachments for email
        att_data = []
        if files:
            for file in files:
                file.file.seek(0)
                att_data.append({
                    "filename": file.filename,
                    "content": file.file.read(),
                    "content_type": file.content_type or "application/octet-stream"
                })

        for email in meeting.participants:
            subject = f"Meeting Invite: {meeting.title}"
            join_link = f"{meeting.invite_url_base}?channel={base_id}&passcode={passcode}"
            
            lines = []
            lines.append(f"Title: {meeting.title}")
            if meeting.start_time:
                lines.append(f"Time: {meeting.start_time.strftime('%Y-%m-%d %H:%M')} {meeting.timezone}")
            lines.append(f"")
            lines.append(f"Join Link: {join_link}")
            lines.append(f"Passcode: {passcode}")
            lines.append(f"")
            if meeting.description:
                lines.append(f"Description:")
                lines.append(meeting.description)
                lines.append(f"")
            if occurrences > 1:
                lines.append(f"This meeting occurs {occurrences} times ({meeting.recurrence}). The same link and passcode apply.")
                


            import urllib.parse
            if meeting.start_time:
                title_enc = urllib.parse.quote(meeting.title)
                start_str = meeting.start_time.strftime('%Y%m%dT%H%M%SZ')
                end_str = meeting.end_time.strftime('%Y%m%dT%H%M%SZ') if getattr(meeting, 'end_time', None) else meeting.start_time.strftime('%Y%m%dT%H%M%SZ')
                link = f"https://calendar.google.com/calendar/render?action=TEMPLATE&text={title_enc}&dates={start_str}/{end_str}&details=Join Link: {urllib.parse.quote(join_link)}"
                if "Add to Google Calendar:" not in chr(10).join(lines):
                    lines.append("")
                    lines.append("Add to Google Calendar:")
                    lines.append(link)
            content_str = chr(10).join(lines)
            EmailService.send_email(db, to_email=email, subject=subject, content=content_str, cc=meeting.cc_participants, bcc=meeting.bcc_participants, attachments=att_data)


    await db.commit()
    
    # Reload meetings with participants eagerly loaded to satisfy the response model
    from sqlalchemy.orm import selectinload
    created_ids = [m.id for m in created_meetings]
    if created_ids:
        res = await db.execute(select(models.Meeting).options(selectinload(models.Meeting.participants)).filter(models.Meeting.id.in_(created_ids)))
        return res.scalars().all()
    
    return []


class SendInvitesRequest(BaseModel):
    participants: List[str] = []
    cc_participants: List[str] = []
    bcc_participants: List[str] = []
    cc_participants: List[str] = []
    bcc_participants: List[str] = []
    invite_url_base: Optional[str] = None
    description_override: Optional[str] = None

@router.post("/{meeting_id}/send-invites")
async def send_invites_for_meeting(
    meeting_id: str,
    invite_data: str = Form(...),
    files: List[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    import json
    data = SendInvitesRequest(**json.loads(invite_data))
    
    result = await db.execute(select(models.Meeting).filter(
        models.Meeting.id == meeting_id,
        models.Meeting.host_id == current_user.id
    ))
    meeting = result.scalars().first()
    
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")

    # Update participants in DB
    for email in data.participants:
        db_participant = models.MeetingParticipant(meeting_id=meeting_id, email=email, role="guest", recipient_type="to")
        db.add(db_participant)
    for email in data.cc_participants:
        db_participant = models.MeetingParticipant(meeting_id=meeting_id, email=email, role="guest", recipient_type="cc")
        db.add(db_participant)
    for email in data.bcc_participants:
        db_participant = models.MeetingParticipant(meeting_id=meeting_id, email=email, role="guest", recipient_type="bcc")
        db.add(db_participant)
        
    if files:
        import os
        os.makedirs("attachments", exist_ok=True)
        for file in files:
            file_path = f"attachments/{meeting_id}_{file.filename}"
            with open(file_path, "wb") as buffer:
                buffer.write(file.file.read())
                file.file.seek(0)
            db_att = models.MeetingAttachment(meeting_id=meeting_id, filename=file.filename, content_type=file.content_type or "application/octet-stream", file_path=file_path)
            db.add(db_att)

    await db.commit()

    if (data.participants or data.cc_participants or data.bcc_participants) and data.invite_url_base:
        att_data = []
        if files:
            for file in files:
                file.file.seek(0)
                att_data.append({
                    "filename": file.filename,
                    "content": file.file.read(),
                    "content_type": file.content_type or "application/octet-stream"
                })

        passcode = meeting.recurrence if meeting.recurrence and meeting.recurrence != 'none' else meeting.id.split('-')[-1].lower()
        
        desc = data.description_override if data.description_override is not None else meeting.description

        for email in data.participants:
            join_link = f"{data.invite_url_base}?channel={meeting.id}&passcode={passcode}"
            
            import urllib.parse
            link = ""
            if meeting.start_time:
                title_enc = urllib.parse.quote(meeting.title)
                start_str = meeting.start_time.strftime('%Y%m%dT%H%M%SZ')
                end_str = meeting.end_time.strftime('%Y%m%dT%H%M%SZ') if getattr(meeting, 'end_time', None) else meeting.start_time.strftime('%Y%m%dT%H%M%SZ')
                link = f"https://calendar.google.com/calendar/render?action=TEMPLATE&text={title_enc}&dates={start_str}/{end_str}&details=Join Link: {urllib.parse.quote(join_link)}"

            variables = {
                "firstName": email.split('@')[0],
                "organizerName": current_user.email,
                "meetingTitle": meeting.title,
                "meetingDate": meeting.start_time.strftime('%Y-%m-%d') if meeting.start_time else "TBD",
                "meetingTime": meeting.start_time.strftime('%H:%M') if meeting.start_time else "TBD",
                "meetingTimezone": meeting.timezone or "",
                "meetingId": meeting.id,
                "meetingPasscode": passcode,
                "meetingJoinUrl": join_link,
                "calendarUrl": link
            }
            
            # Note: attachments, cc, bcc are handled natively in advanced senders, but for now we dispatch to main recipient
            await EmailNotificationService.dispatch(db, "MEETING_INVITATION", email, variables)

    return {"status": "success"}

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

    from sqlalchemy.orm import selectinload
    result = await db.execute(select(models.Meeting).options(selectinload(models.Meeting.participants)).filter(
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

    from sqlalchemy.orm import selectinload
    result = await db.execute(select(models.Meeting).options(selectinload(models.Meeting.participants)).filter(
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

    from sqlalchemy.orm import selectinload
    result = await db.execute(select(models.Meeting).options(selectinload(models.Meeting.participants)).filter(
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
    
    # Send Reschedule Emails if invite base is provided
    if (meeting_data.participants or meeting_data.cc_participants or meeting_data.bcc_participants) and meeting_data.invite_url_base:
        passcode = meeting.recurrence if meeting.recurrence and meeting.recurrence != 'none' else meeting.id.split('-')[-1].lower()
        
        for email in meeting_data.participants:
            join_link = f"{meeting_data.invite_url_base}?channel={meeting.id}&passcode={passcode}"
            
            variables = {
                "firstName": email.split('@')[0],
                "meetingTitle": meeting.title,
                "meetingDate": meeting.start_time.strftime('%Y-%m-%d') if meeting.start_time else "TBD",
                "meetingTime": meeting.start_time.strftime('%H:%M') if meeting.start_time else "TBD",
                "meetingTimezone": meeting.timezone or "",
                "meetingId": meeting.id,
                "meetingPasscode": passcode,
                "meetingJoinUrl": join_link
            }
            await EmailNotificationService.dispatch(db, "MEETING_RESCHEDULED", email, variables)
            
    await db.commit()
    # Eagerly load participants before returning
    result = await db.execute(select(models.Meeting).options(selectinload(models.Meeting.participants)).filter(models.Meeting.id == meeting.id))
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
        
    # Fetch participants before deletion to notify them
    participants = await db.execute(select(models.MeetingParticipant).filter_by(meeting_id=meeting.id))
    for p in participants.scalars().all():
        variables = {
            "firstName": p.email.split('@')[0],
            "meetingTitle": meeting.title,
            "meetingDate": meeting.start_time.strftime('%Y-%m-%d') if meeting.start_time else "TBD",
            "meetingTime": meeting.start_time.strftime('%H:%M') if meeting.start_time else "TBD",
            "meetingTimezone": meeting.timezone or ""
        }
        await EmailNotificationService.dispatch(db, "MEETING_CANCELLED", p.email, variables)
        
    await db.delete(meeting)
    await db.commit()
    return {"status": "success"}
