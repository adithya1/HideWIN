import pytest
from fastapi.testclient import TestClient
from services.api.main import app
from services.api.api.authentication.service import _login_otps

client = TestClient(app)

def test_send_otp_success_bypass():
    """Characterization Test: Email ending with @hidewin.app bypasses email and uses 123456."""
    response = client.post("/auth/send-otp", json={"email": "test@hidewin.app"})
    assert response.status_code == 200
    assert response.json()["success"] is True
    assert _login_otps["test@hidewin.app"] == "123456"

def test_send_otp_invalid_email():
    """Characterization Test: Invalid email format is rejected."""
    response = client.post("/auth/send-otp", json={"email": "not-an-email"})
    assert response.status_code == 422
from services.api.api.authentication.password_service import _reset_tokens
from services.api.models.user import User

@pytest.mark.asyncio
async def test_forgot_password_success(monkeypatch):
    from services.api.api.users.repository import UserRepository
    async def mock_get_user(self, email):
        return User(id=1, email=email, hashed_password="old") if email == "test@test.com" else None
    monkeypatch.setattr(UserRepository, "get_user_by_email", mock_get_user)
    monkeypatch.setattr("services.api.api.authentication.password_service.EmailService.send_email", lambda *args, **kwargs: None)
    
    response = client.post("/auth/forgot-password", json={"email": "test@test.com"})
    assert response.status_code == 200
    assert "reset link has been sent" in response.json()["message"]
    # Check if a token was actually created in the dictionary for this email
    assert "test@test.com" in _reset_tokens.values()

@pytest.mark.asyncio
async def test_forgot_password_not_found(monkeypatch):
    from services.api.api.users.repository import UserRepository
    async def mock_get_user(self, email): return None
    monkeypatch.setattr(UserRepository, "get_user_by_email", mock_get_user)
    monkeypatch.setattr("services.api.api.authentication.password_service.EmailService.send_email", lambda *args, **kwargs: None)
    
    response = client.post("/auth/forgot-password", json={"email": "nobody@test.com"})
    assert response.status_code == 200
    assert "reset link has been sent" in response.json()["message"] # Security feature: don't reveal if email exists
