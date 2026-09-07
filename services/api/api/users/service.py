from services.api.api.users.repository import UserRepository
from services.api.models.user import User

class UserService:
    """
    Core application service layer for managing users.
    Decouples business logic from HTTP controllers and database queries.
    """
    def __init__(self, repo: UserRepository):
        self.repo = repo

    async def get_user_profile(self, email: str) -> dict:
        user = await self.repo.get_user_by_email(email)
        if not user:
            return None
        return {
            "id": user.id,
            "email": user.email,
            "is_active": user.is_active
        }
