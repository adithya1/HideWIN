from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from infrastructure.database.config import get_db, get_reader_db
from infrastructure.repositories.async_meeting_repo import AsyncMeetingRepository
from application.use_cases.meeting_usecase import MeetingUseCase

# In a more complex architecture, a framework like `dependency-injector` or `fastapi-injector` 
# could be used. For FastAPI, native `Depends` provides an excellent lightweight DI container.

# --- REPOSITORIES (Transient/Scoped) ---

def get_meeting_repository(
    db: AsyncSession = Depends(get_db),
    reader_db: AsyncSession = Depends(get_reader_db)
) -> AsyncMeetingRepository:
    """
    Injects the database sessions into the SQL implementation of the Meeting Repository.
    During testing, `get_db` can be overridden to provide a mock session, 
    or this entire dependency can be overridden to provide a MockMeetingRepository.
    """
    return AsyncMeetingRepository(db=db, reader_db=reader_db)


# --- USE CASES (Transient) ---

def get_meeting_usecase(
    repo: AsyncMeetingRepository = Depends(get_meeting_repository)
) -> MeetingUseCase:
    """
    Injects the repository interface into the application use case.
    The Use Case has zero knowledge of SQLAlchemy or HTTP concepts.
    """
    return MeetingUseCase(meeting_repo=repo)


# --- EXTERNAL SERVICES (Singleton/Scoped) ---
# Example: AI Gateway provider injection
# 
# def get_ai_provider() -> AIProvider:
#     return BedrockClaudeProvider()
#
# def get_mock_ai_provider() -> AIProvider:
#     return MockAIProvider()
