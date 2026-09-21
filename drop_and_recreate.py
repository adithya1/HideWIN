import asyncio
from sqlalchemy import text
from services.api.core.database import engine
from services.api.db_models.base import Base
import services.api.db_models

async def recreate_email_templates():
    async with engine.begin() as conn:
        print("Dropping old email_templates...")
        await conn.execute(text("DROP TABLE IF EXISTS email_templates"))
        print("Recreating tables...")
        await conn.run_sync(Base.metadata.create_all)
        print("Done.")

if __name__ == "__main__":
    asyncio.run(recreate_email_templates())
