import sys
import os
import json

# Add project root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from sqlalchemy.orm import Session
from database import SessionLocal
import models
from routers.auth import get_password_hash

def test_hierarchy():
    db = SessionLocal()
    try:
        print("--- 🏰 HIERARCHY VERIFICATION ---")
        
        # 1. Ensure Super Admin exists
        super_admin = db.query(models.User).filter(models.User.email == "super@hidewin.com").first()
        if not super_admin:
            super_admin = models.User(
                email="super@hidewin.com",
                password=get_password_hash("admin123"),
                role="SUPER_ADMIN",
                is_premium=True,
                is_verified=True
            )
            db.add(super_admin)
            db.commit()
            print("[+] Created Super Admin")
        else:
            print("[.] Super Admin already exists")

        # 2. Create a standard Admin
        admin_user = db.query(models.User).filter(models.User.email == "admin@hidewin.com").first()
        if not admin_user:
            admin_user = models.User(
                email="admin@hidewin.com",
                password=get_password_hash("admin123"),
                role="ADMIN",
                is_premium=True,
                is_verified=True
            )
            db.add(admin_user)
            db.commit()
            print("[+] Created Admin")
        else:
            print("[.] Admin already exists")

        # 3. Create a Staff member with specific permissions
        staff_user = db.query(models.User).filter(models.User.email == "staff@hidewin.com").first()
        if not staff_user:
            staff_user = models.User(
                email="staff@hidewin.com",
                password=get_password_hash("staff123"),
                role="STAFF",
                permissions={"view_payments": True, "view_users": True, "reset_hardware": False},
                is_premium=True,
                is_verified=True
            )
            db.add(staff_user)
            db.commit()
            print("[+] Created Staff with permissions: ", staff_user.permissions)
        else:
            print("[.] Staff already exists")

        # 4. Verify Roles
        print(f"\n[SUMMARY]")
        print(f"SUPER_ADMIN: {super_admin.email} (ID: {super_admin.id})")
        print(f"ADMIN: {admin_user.email} (ID: {admin_user.id})")
        print(f"STAFF: {staff_user.email} (ID: {staff_user.id})")

    finally:
        db.close()

if __name__ == "__main__":
    test_hierarchy()
