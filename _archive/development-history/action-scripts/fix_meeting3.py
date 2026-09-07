with open(r'C:\Users\akula\Downloads\Hide-WIN\hidewin-fastapi\src\api\user\meeting.py', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace any literal newlines inside strings with \n
import re

# To fix this fast, I will just write a hardcoded create_meeting function in python and replace the entire function body.
new_func = """
@router.post("/", response_model=List[MeetingResponse])
def create_meeting(
    meeting: MeetingCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    base_id = 'HW-' + str(uuid.uuid4()).split('-')[0].upper() + '-' + str(uuid.uuid4()).split('-')[1].upper()
    passcode = base_id.split('-')[-1].lower()

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
            host_id=current_user.id,
            title=meeting.title,
            description=meeting.description,
            start_time=start_time,
            end_time=end_time,
            timezone=meeting.timezone,
            location=meeting.location,
            recurrence=meeting.recurrence if i == 0 else "none",
            status="SCHEDULED"
        )
        db.add(db_meeting)
        
        for email in meeting.participants:
            db_participant = models.MeetingParticipant(
                meeting_id=meeting_id,
                email=email,
                role="guest"
            )
            db.add(db_participant)
            
        created_meetings.append(db_meeting)
        
    db.commit()
    
    if meeting.participants and meeting.invite_url_base:
        for email in meeting.participants:
            subject = f"Meeting Invite: {meeting.title}"
            join_link = f"{meeting.invite_url_base}?channel={base_id}&passcode={passcode}"
            
            lines = []
            lines.append(f"Hello,")
            lines.append(f"")
            lines.append(f"You have been invited to a meeting scheduled by {current_user.email}.")
            lines.append(f"")
            lines.append(f"Title: {meeting.title}")
            if meeting.start_time:
                lines.append(f"Time: {meeting.start_time.strftime('%Y-%m-%d %H:%M')} {meeting.timezone}")
            if meeting.location:
                lines.append(f"Location: {meeting.location}")
            lines.append(f"")
            lines.append(f"Join Link: {join_link}")
            lines.append(f"Passcode: {passcode}")
            lines.append(f"")
            if meeting.description:
                lines.append(f"Details:")
                lines.append(f"{meeting.description}")
                lines.append(f"")
            if occurrences > 1:
                lines.append(f"This meeting occurs {occurrences} times ({meeting.recurrence}). The same link and passcode apply.")

            content = "\\n".join(lines)
            send_email(db, to_email=email, subject=subject, content=content)
    
    for m in created_meetings:
        db.refresh(m)
        
    return created_meetings
"""
text = re.sub(r'@router\.post\("/", response_model=List\[MeetingResponse\]\).*?return created_meetings', new_func.strip(), text, flags=re.DOTALL)
with open(r'C:\Users\akula\Downloads\Hide-WIN\hidewin-fastapi\src\api\user\meeting.py', 'w', encoding='utf-8') as f:
    f.write(text)
