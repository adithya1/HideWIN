import asyncio
from services.api.core.database import engine
from services.api.db_models.base import Base
import services.api.db_models

async def init_models():
    async with engine.begin() as conn:
        print("Creating new reminder tables...")
        await conn.run_sync(Base.metadata.create_all)
        print("Reminder Tables created.")

if __name__ == "__main__":
    asyncio.run(init_models())
