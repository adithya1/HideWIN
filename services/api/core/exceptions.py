from fastapi import Request
from fastapi.responses import JSONResponse
from pydantic import ValidationError

class ApplicationError(Exception):
    """Base class for application-specific exceptions."""
    def __init__(self, message: str, status_code: int = 400):
        self.message = message
        self.status_code = status_code

async def application_error_handler(request: Request, exc: ApplicationError):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.message, "type": "ApplicationError"}
    )

async def validation_error_handler(request: Request, exc: ValidationError):
    return JSONResponse(
        status_code=422,
        content={"error": "Data validation failed", "details": exc.errors()}
    )
