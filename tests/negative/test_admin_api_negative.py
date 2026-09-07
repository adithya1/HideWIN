import pytest
from fastapi.testclient import TestClient
from services.api.main import app
from services.api.services.auth_service import AuthenticationService

client = TestClient(app)

def test_read_admin_settings_unauthorized():
    # No token provided
    response = client.get("/admin/settings")
    assert response.status_code == 401

def test_read_admin_settings_forbidden():
    # Token provided, but not the admin email
    token = AuthenticationService.create_access_token(data={"sub": "normaluser@example.com"})
    response = client.get("/admin/settings", headers={"Authorization": f"Bearer {token}"})
    
    assert response.status_code == 403
    assert response.json()["detail"] == "Admin privileges required"
