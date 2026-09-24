"""Create or update the configured API administrator account."""
import asyncio

from sqlalchemy import select

from services.api.api.authentication.service import AuthenticationService
from services.api.core.config import settings
from services.api.core.database import async_session
from services.api.models.user import User


async def create_admin() -> None:
    async with async_session() as db:
        result = await db.execute(select(User).where(User.email == settings.ADMIN_EMAIL))
        user = result.scalars().first()
        if user is None:
            user = User(email=settings.ADMIN_EMAIL)
            db.add(user)

        user.hashed_password = AuthenticationService.get_password_hash(settings.ADMIN_PASSWORD)
        user.role = "ADMIN"
        user.is_active = True
        await db.commit()


if __name__ == "__main__":
    asyncio.run(create_admin())
