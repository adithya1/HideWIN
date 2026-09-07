import pytest
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, MagicMock

from services.api.main import app
from services.api.core.database import get_db
from services.api.models.user import User
from services.api.services.auth_service import AuthenticationService

client = TestClient(app)

def test_signup_missing_fields():
    response = client.post("/auth/signup", json={"email": "bad"})
    assert response.status_code == 422

def test_signup_invalid_email():
    response = client.post("/auth/signup", json={"email": "not-an-email", "password": "pwd"})
    assert response.status_code == 422

def test_signup_duplicate_email():
    mock_session = AsyncMock()
    mock_result = MagicMock()
    mock_result.scalars.return_value.first.return_value = User(id=1, email="exists@example.com")
    mock_session.execute.return_value = mock_result
    app.dependency_overrides[get_db] = lambda: mock_session
    
    response = client.post("/auth/signup", json={"email": "exists@example.com", "password": "pwd"})
    assert response.status_code == 400
    assert response.json()["detail"] == "Email already registered"
    app.dependency_overrides.clear()

def test_login_unknown_user():
    mock_session = AsyncMock()
    mock_result = MagicMock()
    mock_result.scalars.return_value.first.return_value = None
    mock_session.execute.return_value = mock_result
    app.dependency_overrides[get_db] = lambda: mock_session
    
    response = client.post("/auth/login", data={"username": "unknown@example.com", "password": "pwd"})
    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect email or password"
    app.dependency_overrides.clear()

def test_login_wrong_password():
    mock_session = AsyncMock()
    mock_result = MagicMock()
    # User exists but password hashes won't match
    hashed = AuthenticationService.get_password_hash("real_password")
    mock_result.scalars.return_value.first.return_value = User(id=1, email="test@example.com", hashed_password=hashed)
    mock_session.execute.return_value = mock_result
    app.dependency_overrides[get_db] = lambda: mock_session
    
    response = client.post("/auth/login", data={"username": "test@example.com", "password": "wrong_password"})
    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect email or password"
    app.dependency_overrides.clear()
