import pytest
from fastapi.testclient import TestClient
from services.api.main import app
from services.api.models.user import User

client = TestClient(app)

@pytest.mark.asyncio
async def test_get_my_profile(monkeypatch):
    from services.api.core.security import get_current_user
    app.dependency_overrides[get_current_user] = lambda: User(id=1, email="user@test.com", is_active=True)
    
    from services.api.core.database import get_db
    class MockDb: pass
    app.dependency_overrides[get_db] = lambda: MockDb()
    
    from services.api.api.users.router import get_user_service
    class MockUserService:
        async def get_user_profile(self, user_id: int):
            return {"id": user_id, "email": "user@test.com", "is_active": True, "full_name": "Test User"}
    app.dependency_overrides[get_user_service] = lambda: MockUserService()
    
    response = client.get("/user/me")
    assert response.status_code == 200
    assert response.json()["email"] == "user@test.com"
    
    app.dependency_overrides.clear()
