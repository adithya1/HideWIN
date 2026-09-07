import sys, os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from passlib.context import CryptContext

# 🏰 HideWIN Elite Base Seeder
# This script initializes the 6-tier hierarchy safely.

# Add the script's directory to sys.path so we can import models/database
script_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(script_dir)

import models
from database import engine, SessionLocal

# Force schema update
models.Base.metadata.create_all(bind=engine)

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")
db = SessionLocal()

def hash_pass(p):
    return pwd_context.hash(p)

def upsert_user(email, password, role, **kwargs):
    print(f"[*] Processing {role}: {email}...")
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        user = models.User(
            email=email,
            password=hash_pass(password),
            role=role,
            is_verified=True,
            **kwargs
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        print(f"✅ Created {role}: {email}")
    else:
        user.password = hash_pass(password)
        db.commit()
        print(f"♻️  Updated {role}: {email}")
    return user

def upsert_plan(name, slug, price, features):
    plan = db.query(models.Plan).filter(models.Plan.slug == slug).first()
    if not plan:
        plan = models.Plan(name=name, slug=slug, price_monthly=price, features=features, is_active=True)
        db.add(plan)
    db.commit()
    return plan

if __name__ == "__main__":
    print("--- 🏰 SEEDING HIDEWIN ELITE HIERARCHY (v2.5) ---")
    
    # 1. Super Admin
    upsert_user("admin@hidewin.com", "adminpassword123", "SUPER_ADMIN", full_name="Super Admin", is_premium=True)
    
    # 2. Vendor
    v = upsert_user("starkindustries@vendor.com", "vendorpassword123", "VENDOR", full_name="Stark Industries", allocated_seats=10, is_premium=True)
    
    # 3. Standard User
    upsert_user("tony.stark@starkindustries.com", "password123", "USER", full_name="Tony Stark", vendor_id=v.id, is_premium=True)
    
    # 4. Foundation Plans
    upsert_plan("Free", "free", 0.0, ["1 session/day"])
    upsert_plan("Pro", "pro", 42.0, ["Unlimited Everything"])
    
    db.close()
    print("--- 🏁 SEEDING COMPLETE ---")
