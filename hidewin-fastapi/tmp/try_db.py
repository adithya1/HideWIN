import sys
sys.path.append(r'c:\Users\akula\Downloads\HideWIN\hidewin-fastapi')

from database import SessionLocal
import models

def check_db():
    db = SessionLocal()
    try:
        # Just query one user to trigger mapper initialization
        u = db.query(models.User).first()
        print(f"User check: {u.email if u else 'No user'}")
        
        # Test Session creation
        import uuid
        s_id = str(uuid.uuid4())
        s = models.Session(id=s_id, user_id=u.id if u else 1, title="Test")
        db.add(s)
        db.commit()
        print(f"Session test: SUCCESS (ID: {s_id})")
        
        db.delete(s)
        db.commit()
        print("Final Verdict: DATABASE LAYER STABLE 🚀")
    except Exception as e:
        print(f"FAILED: {str(e)}")
    finally:
        db.close()

if __name__ == "__main__":
    check_db()
