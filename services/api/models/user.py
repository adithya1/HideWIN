from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    role = Column(String, default='USER')
    
    # OTP Rate Limiting
    failed_otp_attempts = Column(Integer, default=0)
    otp_block_level = Column(Integer, default=0)
    blocked_until = Column(DateTime(timezone=True), nullable=True)
    admin_unblock_required = Column(Boolean, default=False)
