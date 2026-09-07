with open('run_api.py', 'r', encoding='utf-8') as f:
    content = f.read()

import_statement = "from src.api.admin import email_templates"
router_statement = 'app.include_router(email_templates.router, prefix="/api/admin")'

if import_statement not in content:
    content = content.replace("from src.api.user import auth, meeting", "from src.api.user import auth, meeting\n" + import_statement)
    content = content.replace("app.include_router(meeting.router)", "app.include_router(meeting.router)\n" + router_statement)

with open('run_api.py', 'w', encoding='utf-8') as f:
    f.write(content)
print("Added router to run_api.py")
