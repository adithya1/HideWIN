from fastapi import FastAPI
from pydantic import ValidationError
from services.api.core.config import settings
from services.api.routers import admin, auth, ws, ai_proxy
from services.api.core.exceptions import ApplicationError, application_error_handler, validation_error_handler

app = FastAPI(title="Hide-WIN API", version="1.0.0", debug=settings.DEBUG)
app.include_router(admin.router)
app.include_router(auth.router)
app.include_router(ws.router)
app.include_router(ai_proxy.router)

app.add_exception_handler(ApplicationError, application_error_handler)
app.add_exception_handler(ValidationError, validation_error_handler)

@app.get("/health")
async def health_check():
    return {"status": "ok", "environment": settings.APP_ENV}
