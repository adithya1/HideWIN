import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "hidewin.db")
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{DB_PATH}")

is_sqlite = "sqlite" in SQLALCHEMY_DATABASE_URL

# Enterprise connection pooling settings for PostgreSQL/MySQL
engine_args = {}
if is_sqlite:
    engine_args["connect_args"] = {"check_same_thread": False}
else:
    # Handle high-concurrency connections safely
    engine_args["pool_size"] = int(os.getenv("DB_POOL_SIZE", 20))
    engine_args["max_overflow"] = int(os.getenv("DB_MAX_OVERFLOW", 30))
    engine_args["pool_pre_ping"] = True
    engine_args["pool_recycle"] = 1800  # Recycle connections every 30 minutes

engine = create_engine(SQLALCHEMY_DATABASE_URL, **engine_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

from db_models.base import Base

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
