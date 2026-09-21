import re

file_path = "services/api/main.py"
with open(file_path, "r", encoding="utf-8") as f:
    text = f.read()

import_statement = """from apscheduler.schedulers.asyncio import AsyncIOScheduler
from services.api.services.reminder_service import ReminderService
"""

startup_event = """@app.on_event("startup")
async def start_scheduler():
    scheduler = AsyncIOScheduler()
    scheduler.add_job(ReminderService.process_reminders, 'interval', minutes=5)
    scheduler.start()
    print("Background Meeting Reminder Scheduler started.")
"""

# Inject before @app.get("/health")
if "start_scheduler" not in text:
    text = text.replace("@app.get(\"/health\")", import_statement + "\n" + startup_event + "\n@app.get(\"/health\")")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(text)

print("Injected APScheduler into main.py!")
