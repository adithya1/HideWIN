import pytest
from fastapi.testclient import TestClient
from services.api.main import app
from services.api.services.auth_service import AuthenticationService
from services.api.core.config import settings

client = TestClient(app)

def test_read_admin_settings_success():
    # 1. Generate a valid admin token
    token = AuthenticationService.create_access_token(data={"sub": settings.ADMIN_EMAIL})
    
    # 2. Make request with token
    response = client.get("/admin/settings", headers={"Authorization": f"Bearer {token}"})
    
    # 3. Assert success
    assert response.status_code == 200
    assert response.json()["admin_email"] == settings.ADMIN_EMAIL
