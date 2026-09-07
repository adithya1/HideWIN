import pytest
from unittest.mock import AsyncMock, MagicMock
from services.api.repositories.user_repo import UserRepository
from services.api.models.user import User

@pytest.mark.asyncio
async def test_get_user_by_email_found():
    # Mock database session
    mock_session = AsyncMock()
    mock_result = MagicMock()
    mock_user = User(id=1, email="test@example.com")
    
    mock_result.scalars.return_value.first.return_value = mock_user
    mock_session.execute.return_value = mock_result
    
    repo = UserRepository(db=mock_session)
    user = await repo.get_user_by_email("test@example.com")
    
    assert user is not None
    assert user.email == "test@example.com"
