import re
path = r'C:\Users\akula\Downloads\Hide-WIN\hidewin-fastapi\src\api\user\meeting.py'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

new_sig = """def create_meeting(
    meeting_data: str = Form(...),
    files: List[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    import json
    meeting = MeetingCreate(**json.loads(meeting_data))"""

content = re.sub(r'def create_meeting\(\s*meeting:\s*MeetingCreate,\s*db:\s*Session\s*=\s*Depends\(get_db\),\s*current_user:\s*models\.User\s*=\s*Depends\(get_current_user\)\s*\):', new_sig.strip(), content)

# Process files and CC/BCC
processing = """        for email in meeting.participants:
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
                db.add(db_att)"""
                
content = re.sub(r'\s*for email in meeting\.participants:.*?db\.add\(db_participant\)', "\n" + processing + "\n", content, flags=re.DOTALL)

# Handle email sending
email_logic = """
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
                
            content_str = chr(10).join(lines)
            send_email(db, to_email=email, subject=subject, content=content_str, cc=meeting.cc_participants, bcc=meeting.bcc_participants, attachments=att_data)
"""

content = re.sub(r'\s*if meeting\.participants and meeting\.invite_url_base:.*?(?=\s*for m in created_meetings:)', "\n" + email_logic + "\n", content, flags=re.DOTALL)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
