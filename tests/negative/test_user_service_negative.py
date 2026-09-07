import pytest
from unittest.mock import AsyncMock
from services.api.services.user_service import UserService

@pytest.mark.asyncio
async def test_get_user_profile_not_found():
    mock_repo = AsyncMock()
    mock_repo.get_user_by_email.return_value = None
    
    service = UserService(repo=mock_repo)
    profile = await service.get_user_profile("unknown@test.com")
    
    assert profile is None
