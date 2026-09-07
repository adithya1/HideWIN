with open(r"C:\Users\akula\Downloads\Hide-WIN\hidewin-fastapi\src\api\user\meeting.py", "r", encoding="utf-8") as f:
    content = f.read()

new_routes = """
@router.put("/{meeting_id}", response_model=MeetingResponse)
def update_meeting(
    meeting_id: str,
    meeting_data: MeetingCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    meeting = db.query(models.Meeting).filter(
        models.Meeting.id == meeting_id,
        models.Meeting.host_id == current_user.id
    ).first()
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
            subject = f"[Rescheduled] Meeting Invite: {meeting.title}"
            join_link = f"{meeting_data.invite_url_base}?channel={meeting.id}&passcode={passcode}"
            
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
                
            content_str = chr(10).join(lines)
            send_email(db, to_email=email, subject=subject, content=content_str, cc=meeting_data.cc_participants, bcc=meeting_data.bcc_participants)
            
    db.commit()
    db.refresh(meeting)
    return meeting

@router.delete("/clear-all")
def clear_all_meetings(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db.query(models.Meeting).filter(models.Meeting.host_id == current_user.id).delete()
    db.commit()
    return {"status": "success"}

@router.delete("/{meeting_id}")
def delete_meeting(meeting_id: str, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    meeting = db.query(models.Meeting).filter(
        models.Meeting.id == meeting_id,
        models.Meeting.host_id == current_user.id
    ).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
        
    db.delete(meeting)
    db.commit()
    return {"status": "success"}
"""

content = content + new_routes

with open(r"C:\Users\akula\Downloads\Hide-WIN\hidewin-fastapi\src\api\user\meeting.py", "w", encoding="utf-8") as f:
    f.write(content)
print("Added CRUD routes for meetings")
