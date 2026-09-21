import asyncio
from services.api.core.database import engine
from services.api.db_models.base import Base
# Import all models to register them
import services.api.db_models

async def init_models():
    async with engine.begin() as conn:
        print("Creating tables...")
        await conn.run_sync(Base.metadata.create_all)
        print("Tables created.")

if __name__ == "__main__":
    asyncio.run(init_models())
