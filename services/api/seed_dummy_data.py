import os
from dotenv import load_dotenv
import models
from database import engine, SessionLocal
from passlib.context import CryptContext

load_dotenv()

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

def seed_db():
    print("Seeding database with dummy data...")
    models.Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # 1. Clear existing data to avoid conflicts on re-run
    db.query(models.Task).delete()
    db.query(models.Goal).delete()
    db.query(models.Device).delete()
    db.query(models.User).delete()
    db.commit()

    # 2. Create Super Admin
    admin_email = os.getenv("ADMIN_EMAIL", "admin@hidewin.com")
    admin_pass = os.getenv("ADMIN_PASSWORD", "adminpassword123")
    admin_hashed_pass = pwd_context.hash(admin_pass)
    admin = models.User(email=admin_email, password=admin_hashed_pass, role="ADMIN", is_premium=True, is_verified=True, logo_url="/public/logos/admin/logo.png")
    db.add(admin)

    # 3. Create Maintainer
    maintain_email = os.getenv("MAINTAINER_EMAIL", "maintain@hidewin.com")
    maintain_pass = os.getenv("MAINTAINER_PASSWORD", "maintainpassword123")
    maintain_hashed_pass = pwd_context.hash(maintain_pass)
    maintainer = models.User(
        email=maintain_email, 
        password=maintain_hashed_pass, 
        role="MAINTAINER", 
        is_premium=True,
        is_verified=True
    )
    db.add(maintainer)
    db.commit()

    # 4. Create Standard User
    user_pass = pwd_context.hash("password123")
    user1 = models.User(
        email="tony.stark@starkindustries.com", 
        password=user_pass, 
        role="USER", 
        is_premium=True,
        is_verified=True
    )
    db.add(user1)
    db.commit()

    print("Database seeded successfully!")
    print("Test Accounts:")
    print(f"Admin: {admin_email} / {admin_pass}")
    print(f"Maintainer: {maintain_email} / {maintain_pass}")
    print("User: tony.stark@starkindustries.com / password123")

if __name__ == "__main__":
    seed_db()
