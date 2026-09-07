import re
path = r'C:\Users\akula\Downloads\Hide-WIN\hidewin-fastapi\run_api.py'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("from src.api.user import auth, user, context, code_pilot, resume, ai_proxy, stt, keys, calendar", "from src.api.user import auth, user, context, code_pilot, resume, ai_proxy, stt, keys, calendar, meeting")
content = content.replace("app.include_router(keys.router)", "app.include_router(keys.router)\napp.include_router(meeting.router)")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
