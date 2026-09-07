from fastapi import FastAPI
from services.api.core.config import settings
from services.api.routers import admin

app = FastAPI(title="Hide-WIN API", version="1.0.0", debug=settings.DEBUG)
app.include_router(admin.router)

@app.get("/health")
async def health_check():
    return {"status": "ok", "environment": settings.APP_ENV}
