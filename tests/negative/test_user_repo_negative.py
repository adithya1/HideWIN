import pytest
from unittest.mock import AsyncMock, MagicMock
from services.api.repositories.user_repo import UserRepository

@pytest.mark.asyncio
async def test_get_user_by_email_not_found():
    mock_session = AsyncMock()
    mock_result = MagicMock()
    
    mock_result.scalars.return_value.first.return_value = None
    mock_session.execute.return_value = mock_result
    
    repo = UserRepository(db=mock_session)
    user = await repo.get_user_by_email("unknown@example.com")
    
    assert user is None
