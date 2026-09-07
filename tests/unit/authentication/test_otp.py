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
