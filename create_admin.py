import sys
import os
sys.path.append(r"C:\Users\akula\Downloads\Hide-WIN\hidewin-fastapi")

from src.lib.database import SessionLocal
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")
hashed_password = pwd_context.hash("adminpassword123")

db = SessionLocal()

# We need to import the user model
from db_models import User

# Check if admin already exists
admin = db.query(User).filter(User.email == "admin").first()
if not admin:
    admin = User(email="admin", hashed_password=hashed_password, role="admin", full_name="System Admin", is_verified=True, user_type="INDIVIDUAL")
    db.add(admin)
else:
    admin.hashed_password = hashed_password
    admin.role = "admin"

db.commit()
print("Admin user created/updated successfully!")
