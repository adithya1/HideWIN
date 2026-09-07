import pytest
from unittest.mock import AsyncMock
from services.api.services.user_service import UserService
from services.api.models.user import User

@pytest.mark.asyncio
async def test_get_user_profile_success():
    mock_repo = AsyncMock()
    mock_repo.get_user_by_email.return_value = User(id=1, email="test@test.com", is_active=True)
    
    service = UserService(repo=mock_repo)
    profile = await service.get_user_profile("test@test.com")
    
    assert profile["email"] == "test@test.com"
    assert profile["is_active"] is True
