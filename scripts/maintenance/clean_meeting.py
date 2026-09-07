with open(r'C:\Users\akula\Downloads\Hide-WIN\hidewin-fastapi\src\api\user\meeting.py', 'r', encoding='utf-8') as f:
    content = f.read()

bad_code = """            import urllib.parse
            if meeting.start_time:
                title_enc = urllib.parse.quote(meeting.title)
                start_str = meeting.start_time.strftime('%Y%m%dT%H%M%SZ')
                end_str = (meeting.start_time).strftime('%Y%m%dT%H%M%SZ') # Assuming 1hr if no end time available here
                link = f"https://calendar.google.com/calendar/render?action=TEMPLATE&text={title_enc}&dates={start_str}/{end_str}&details=Join Link: {urllib.parse.quote(join_link)}"
                lines.append("")
                lines.append("Add to Google Calendar:")
                lines.append(link)"""

content = content.replace(bad_code, "")

with open(r'C:\Users\akula\Downloads\Hide-WIN\hidewin-fastapi\src\api\user\meeting.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("Cleaned up meeting.py duplicate code")
