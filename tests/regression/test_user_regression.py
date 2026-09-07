import pytest
from fastapi.testclient import TestClient
from services.api.main import app
from services.api.core.exceptions import ApplicationError

client = TestClient(app)

def test_exception_handler_regression():
    """
    Regression Test:
    Verifies that the global exception handlers correctly trap custom errors 
    and format them into the standard JSON response format, preventing unhandled 500s.
    """
    @app.get("/test_error")
    def throw_error():
        raise ApplicationError("Business rule violated", status_code=400)
        
    response = client.get("/test_error")
    assert response.status_code == 400
    
    data = response.json()
    assert data["type"] == "ApplicationError"
    assert data["error"] == "Business rule violated"
