import sys
sys.path.append('.')
from passlib.context import CryptContext
from database import SessionLocal
import models

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

db = SessionLocal()

# Reset admin password to Admin@123
admin = db.query(models.User).filter_by(email="admin@hidewin.com").first()
if admin:
    admin.hashed_password = pwd_context.hash("Admin@123")
    db.commit()
    print(f"[OK] Reset admin@hidewin.com password to: Admin@123")

# Insert test users with known passwords
test_users = [
    {"email": "testuser1@hidewin.app", "full_name": "Test User One", "role": "USER", "password": "Test@1234", "is_premium": True, "is_verified": True},
    {"email": "testuser2@hidewin.app", "full_name": "Test User Two", "role": "USER", "password": "Test@1234", "is_premium": False, "is_verified": True},
    {"email": "staff@hidewin.app", "full_name": "Support Staff", "role": "STAFF", "password": "Staff@1234", "is_premium": True, "is_verified": True},
]

for u in test_users:
    existing = db.query(models.User).filter_by(email=u["email"]).first()
    if not existing:
        new_user = models.User(
            email=u["email"],
            full_name=u["full_name"],
            role=u["role"],
            hashed_password=pwd_context.hash(u["password"]),
            is_premium=u["is_premium"],
            is_verified=u["is_verified"],
            is_suspended=False
        )
        db.add(new_user)
        print(f"[ADDED] {u['email']} (password: {u['password']})")
    else:
        existing.full_name = u["full_name"]
        existing.hashed_password = pwd_context.hash(u["password"])
        print(f"[UPDATED] {u['email']} (password: {u['password']})")

db.commit()

# Show all users
all_users = db.query(models.User).all()
print("\n=== All Users in DB ===")
for u in all_users:
    print(f"  ID:{u.id} | {u.email} | Role:{u.role} | Premium:{u.is_premium} | Suspended:{u.is_suspended}")

db.close()
