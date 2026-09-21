import re

file_path = "services/api/routers/meeting.py"
with open(file_path, "r", encoding="utf-8") as f:
    text = f.read()

cancel_injection = """    # Fetch participants before deletion to notify them
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
    await db.commit()"""

text = text.replace("    db.delete(meeting)\n    await db.commit()", cancel_injection)
# Note: we need to replace `db.delete(meeting)` with `await db.delete(meeting)` depending on async db syntax.
# Actually in SQLAlchemy 2.0 with async_session: `await db.delete(meeting)`

with open(file_path, "w", encoding="utf-8") as f:
    f.write(text)

print("Meeting cancel event hooked up!")
