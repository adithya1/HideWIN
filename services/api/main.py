from fastapi import FastAPI
from services.api.core.config import settings

app = FastAPI(title="Hide-WIN API", version="1.0.0", debug=settings.DEBUG)

@app.get("/health")
async def health_check():
    """
    Simple health check endpoint.
    Used by Kubernetes liveness probes and ALB target groups.
    """
    return {"status": "ok", "environment": settings.APP_ENV}
