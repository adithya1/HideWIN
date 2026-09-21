import re

file_path = "services/api/routers/meeting.py"
with open(file_path, "r", encoding="utf-8") as f:
    text = f.read()

# Add import
if "EmailNotificationService" not in text:
    text = text.replace("from services.api.services.email_service import EmailService", "from services.api.services.email_service import EmailService, EmailNotificationService")

# We will just replace the hardcoded EmailService.send_email with the dispatch logic.
# Wait, replacing complex blocks with regex is risky. Let's do string replacement.

old_invite_block = """        for email in data.participants:
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
            EmailService.send_email(db, to_email=email, subject=subject, content=content_str, cc=data.cc_participants, bcc=data.bcc_participants, attachments=att_data)"""

new_invite_block = """        for email in data.participants:
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
            await EmailNotificationService.dispatch(db, "MEETING_INVITATION", email, variables)"""


old_update_block = """        for email in meeting_data.participants:
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
            EmailService.send_email(db, to_email=email, subject=subject, content=content_str, cc=meeting_data.cc_participants, bcc=meeting_data.bcc_participants)"""

new_update_block = """        for email in meeting_data.participants:
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
            await EmailNotificationService.dispatch(db, "MEETING_RESCHEDULED", email, variables)"""


text = text.replace(old_invite_block, new_invite_block)
text = text.replace(old_update_block, new_update_block)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(text)

print("Meeting Router rewritten to use EmailNotificationService!")
