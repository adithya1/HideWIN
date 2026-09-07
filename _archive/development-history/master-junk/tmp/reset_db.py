import sys
sys.path.append(r'c:\Users\akula\Downloads\HideWIN\hidewin-fastapi')

from database import engine, Base
import models

def reset_db():
    print("--- 🔨 DATABASE SCHEMA RECONSTRUCTION ---")
    try:
        # Drop all existing tables to resolve mapper/schema drift
        Base.metadata.drop_all(bind=engine)
        print("  ✔ Successfully dropped existing tables.")
        
        # Recreate all tables with the new Optimized Relationship System
        Base.metadata.create_all(bind=engine)
        print("  ✔ Successfully reconstructed all tables.")
        
        # Add a default admin for E2E testing
        from database import SessionLocal
        db = SessionLocal()
        from routers.auth import get_password_hash
        admin = models.User(
            email="admin@hidewin.com",
            password=get_password_hash("admin123"),
            full_name="HideWIN Admin",
            role="ADMIN",
            is_premium=True,
            is_verified=True,
            user_type="SELF"
        )
        db.add(admin)
        db.commit()
        print("  ✔ Created default test admin (admin@hidewin.com / admin123).")
        db.close()
        
        print("\n[RESULT] Database Reconstruction: SUCCESS 🚀")
    except Exception as e:
        print(f"\n[RESULT] Database Reconstruction: FAILED ❌\nError: {str(e)}")

if __name__ == "__main__":
    reset_db()
