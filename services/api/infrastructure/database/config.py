from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.pool import NullPool
import os

# For PgBouncer compatibility (transaction mode), we use NullPool and let PgBouncer handle pooling
DATABASE_URL = os.environ["DATABASE_URL"]

# Writer Engine (Primary)
engine = create_async_engine(
    DATABASE_URL,
    poolclass=NullPool,
    echo=False
)

# Reader Engine (Replica) - Used for heavy read queries to offload the primary
READER_DATABASE_URL = os.getenv("READER_DATABASE_URL", DATABASE_URL)
reader_engine = create_async_engine(
    READER_DATABASE_URL,
    poolclass=NullPool,
    echo=False
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False
)

AsyncReaderSessionLocal = async_sessionmaker(
    bind=reader_engine,
    class_=AsyncSession,
    expire_on_commit=False
)

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

async def get_reader_db():
    async with AsyncReaderSessionLocal() as session:
        yield session
