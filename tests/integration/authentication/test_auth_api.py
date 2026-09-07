import pytest
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock

from services.api.main import app
from services.api.core.database import get_db
from services.api.models.user import User

client = TestClient(app)

@pytest.mark.asyncio
async def test_signup_positive():
    mock_session = AsyncMock()
    # Return None for get_user_by_email to simulate new user
    mock_result = AsyncMock()
    mock_result.scalars.return_value.first.return_value = None
    mock_session.execute.return_value = mock_result
    
    app.dependency_overrides[get_db] = lambda: mock_session
    
    # We also have to patch db.add, db.commit, db.refresh
    # But for a true integration test, we'd use a test DB. 
    # For now, we mock the session's behavior.
    
    response = client.post("/auth/signup", json={"email": "new@example.com", "password": "secure123"})
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "new@example.com"
    app.dependency_overrides.clear()
