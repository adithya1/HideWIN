import re
path = r'C:\Users\akula\Downloads\Hide-WIN\hidewin-fastapi\src\api\user\meeting.py'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add invite_url_base to schema
content = content.replace("participants: List[str] = []", "participants: List[str] = []\n    invite_url_base: Optional[str] = None")

# Add auth import
content = content.replace("from src.api.user.auth import get_current_user", "from src.api.user.auth import get_current_user, send_email\nfrom datetime import timedelta")

# Update create_meeting logic
new_logic = """
@router.post("/", response_model=List[MeetingResponse])
def create_meeting(
    meeting: MeetingCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    base_id = 'HW-' + str(uuid.uuid4()).split('-')[0].upper() + '-' + str(uuid.uuid4()).split('-')[1].upper()
    passcode = str(uuid.uuid4())[:8]

    # Handle recurrence logic (generate multiple meetings)
    occurrences = 1
    if meeting.recurrence == "daily":
        occurrences = 5
    elif meeting.recurrence == "weekly":
        occurrences = 4

    created_meetings = []
    
    for i in range(occurrences):
        suffix = f"-{i}" if i > 0 else ""
        meeting_id = base_id + suffix
        
        # Calculate shifted start and end times
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
            recurrence=meeting.recurrence if i == 0 else "none", # Only mark the first as the recurring parent
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
    
    # Send SMTP Email Invites
    if meeting.participants and meeting.invite_url_base:
        for email in meeting.participants:
            subject = f"Meeting Invite: {meeting.title}"
            join_link = f"{meeting.invite_url_base}?channel={base_id}&passcode={passcode}"
            
            content = f"Hello,\n\nYou have been invited to a meeting scheduled by {current_user.email}.\n\n"
            content += f"Title: {meeting.title}\n"
            if meeting.start_time:
                content += f"Time: {meeting.start_time.strftime('%Y-%m-%d %H:%M')} {meeting.timezone}\n"
            if meeting.location:
                content += f"Location: {meeting.location}\n"
            content += f"\nJoin Link: {join_link}\nPasscode: {passcode}\n\n"
            if meeting.description:
                content += f"Details:\n{meeting.description}\n\n"
                
            if occurrences > 1:
                content += f"This meeting occurs {occurrences} times ({meeting.recurrence}). The same link and passcode apply.\n"

            # Execute background send (this is blocking but fine for MVP)
            send_email(db, to_email=email, subject=subject, content=content)
    
    for m in created_meetings:
        db.refresh(m)
        
    return created_meetings
"""
content = re.sub(r'@router\.post\("/", response_model=MeetingResponse\).*?return db_meeting', new_logic.strip(), content, flags=re.DOTALL)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
