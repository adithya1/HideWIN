import re
with open(r'C:\Users\akula\Downloads\Hide-WIN\hidewin-fastapi\src\api\user\meeting.py', 'r', encoding='utf-8') as f:
    content = f.read()

# I want to append a Google Calendar link to the email.
def make_cal_link(start_var, end_var):
    # This is tricky because we're inside python code constructing the email.
    pass

# Actually, let's just do a simple patch
replacement = """
            if occurrences > 1:
                lines.append(f"This meeting occurs {occurrences} times ({meeting.recurrence}). The same link and passcode apply.")
                
            import urllib.parse
            if meeting.start_time:
                title_enc = urllib.parse.quote(meeting.title)
                start_str = meeting.start_time.strftime('%Y%m%dT%H%M%SZ')
                end_str = (meeting.start_time).strftime('%Y%m%dT%H%M%SZ') # Assuming 1hr if no end time available here
                link = f"https://calendar.google.com/calendar/render?action=TEMPLATE&text={title_enc}&dates={start_str}/{end_str}&details=Join Link: {urllib.parse.quote(join_link)}"
                lines.append("")
                lines.append("Add to Google Calendar:")
                lines.append(link)

            content_str = chr(10).join(lines)
"""
content = content.replace("""
            if occurrences > 1:
                lines.append(f"This meeting occurs {occurrences} times ({meeting.recurrence}). The same link and passcode apply.")
                
            content_str = chr(10).join(lines)
""", replacement)

with open(r'C:\Users\akula\Downloads\Hide-WIN\hidewin-fastapi\src\api\user\meeting.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated meeting.py to send GCal link in emails")
