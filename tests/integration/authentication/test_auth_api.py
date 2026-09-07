import pytest
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, MagicMock

from services.api.main import app
from services.api.core.database import get_db
from services.api.models.user import User

client = TestClient(app)

@pytest.mark.asyncio
async def test_signup_positive():
    mock_session = AsyncMock()
    # Return None for get_user_by_email to simulate new user
    mock_result = MagicMock()
    mock_result.scalars.return_value.first.return_value = None
    mock_session.execute.return_value = mock_result
    
    app.dependency_overrides[get_db] = lambda: mock_session
    
    # We also have to patch db.add, db.commit, db.refresh
    async def mock_refresh(obj):
        obj.id = 1
        obj.is_active = True

    mock_session.refresh.side_effect = mock_refresh
    
    response = client.post("/auth/signup", json={"email": "new@example.com", "password": "secure123"})
    print(response.json())
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "new@example.com"
    app.dependency_overrides.clear()
