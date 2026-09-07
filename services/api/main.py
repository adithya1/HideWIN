from fastapi import FastAPI
from pydantic import ValidationError
from services.api.core.config import settings
from services.api.routers import admin, ws, ai_proxy, meeting
from services.api.api.authentication.router import router as auth
from services.api.api.transcription.admin import router as stt_admin
from services.api.api.transcription.websocket import router as stt_ws
from services.api.api.users.router import router as user_router
from services.api.api.devices.router import router as devices_router
from services.api.api.notifications.router import router as notifications_router
from services.api.api.system.router import router as system_router
from services.api.api.ai_config.router import router as llm_router
from services.api.api.calendar.router import router as calendar_router
from services.api.api.resume.router import router as resume_router
from services.api.api.code_pilot.router import router as code_pilot_router
from services.api.api.context.router import router as context_router
from services.api.api.billing.router import router as billing_router
from services.api.api.vendor.router import router as vendor_router
from services.api.api.team.router import router as team_router

from services.api.core.exceptions import ApplicationError, application_error_handler, validation_error_handler

app = FastAPI(title="Hide-WIN API", version="1.0.0", debug=settings.DEBUG)
app.include_router(admin.router)
app.include_router(auth)
app.include_router(stt_admin)
app.include_router(stt_ws)
app.include_router(user_router)
app.include_router(devices_router)
app.include_router(notifications_router)
app.include_router(system_router)
app.include_router(llm_router)
app.include_router(calendar_router)
app.include_router(resume_router)
app.include_router(code_pilot_router)
app.include_router(context_router)
app.include_router(billing_router)
app.include_router(vendor_router)
app.include_router(team_router)
app.include_router(ws.router)
app.include_router(ai_proxy.router)
app.include_router(meeting.router)

app.add_exception_handler(ApplicationError, application_error_handler)
app.add_exception_handler(ValidationError, validation_error_handler)

@app.get("/health")
async def health_check():
    return {"status": "ok", "environment": settings.APP_ENV}
