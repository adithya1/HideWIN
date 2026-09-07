import re
with open(r'C:\Users\akula\Downloads\Hide-WIN\hidewin-fastapi\src\api\user\meeting.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace any occurrence of content_str = chr(10).join(lines) with GCal link addition
# We'll use a regex to find where `content_str = chr(10).join(lines)` is, and if it doesn't already have GCal code above it, we insert it.

gcal_logic = """
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
"""

content = re.sub(r"content_str = chr\(10\)\.join\(lines\)", gcal_logic.strip(), content)

with open(r'C:\Users\akula\Downloads\Hide-WIN\hidewin-fastapi\src\api\user\meeting.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("Patched all emails to include GCal links")
