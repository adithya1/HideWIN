import re

with open(r'C:\Users\akula\Downloads\Hide-WIN\hidewin-fastapi\src\api\user\meeting.py', 'r', encoding='utf-8') as f:
    content = f.read()

new_endpoint = """
class SendInvitesRequest(BaseModel):
    participants: List[str] = []
    cc_participants: List[str] = []
    bcc_participants: List[str] = []
    invite_url_base: Optional[str] = None
    description_override: Optional[str] = None

@router.post("/{meeting_id}/send-invites")
def send_invites_for_meeting(
    meeting_id: str,
    invite_data: str = Form(...),
    files: List[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    import json
    data = SendInvitesRequest(**json.loads(invite_data))
    
    meeting = db.query(models.Meeting).filter(
        models.Meeting.id == meeting_id,
        models.Meeting.host_id == current_user.id
    ).first()
    
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

    db.commit()

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
            subject = f"Meeting Invite: {meeting.title}"
            join_link = f"{data.invite_url_base}?channel={meeting.id}&passcode={passcode}"
            
            lines = []
            lines.append(f"Title: {meeting.title}")
            if meeting.start_time:
                lines.append(f"Time: {meeting.start_time.strftime('%Y-%m-%d %H:%M')} {meeting.timezone}")
            lines.append(f"")
            lines.append(f"Join Link: {join_link}")
            lines.append(f"Passcode: {passcode}")
            lines.append(f"")
            if desc:
                lines.append(f"Description:")
                lines.append(desc)
                lines.append(f"")
                
            content_str = chr(10).join(lines)
            send_email(db, to_email=email, subject=subject, content=content_str, cc=data.cc_participants, bcc=data.bcc_participants, attachments=att_data)

    return {"status": "success"}

@router.get("/upcoming"
"""

content = content.replace('@router.get("/upcoming"', new_endpoint)

with open(r'C:\Users\akula\Downloads\Hide-WIN\hidewin-fastapi\src\api\user\meeting.py', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated meeting.py")
