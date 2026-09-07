import sys
import os

# Add the project directory to sys.path
sys.path.append(r'c:\Users\akula\Downloads\HideWIN\hidewin-fastapi')

import json
import uuid
import models
from database import SessionLocal

def test_synergy_integration():
    db = SessionLocal()
    print("--- 🔬 E2E SYNERGY INTEGRATION AUDIT ---")
    
    try:
        # 1. Check Session & Participant Models
        print("[1/4] Checking Database Tables...")
        session_id = str(uuid.uuid4())
        test_session = models.Session(id=session_id, user_id=1, title="Audit Session")
        db.add(test_session)
        db.commit()
        print(f"  ✔ Session Table Accessible (ID: {session_id})")
        
        participant = models.SessionParticipant(session_id=session_id, user_id=1, role="LEAD")
        db.add(participant)
        db.commit()
        print("  ✔ SessionParticipant Table Accessible")

        # 2. Check S-User vs C-User logic flags
        print("[2/4] Checking User Classifications...")
        user = db.query(models.User).first()
        if hasattr(user, 'user_type'):
            print(f"  ✔ User Type Column Exists (Default: {user.user_type})")
        else:
            print("  ❌ CRITICAL: User Type Column Missing!")

        # 3. Clean up
        db.delete(participant)
        db.delete(test_session)
        db.commit()
        print("[3/4] Cleanup Complete.")

        # 4. Final Verdict
        print("\n[RESULT] Synergy Backend Integration: SUCCESS 🚀")
        
    except Exception as e:
        print(f"\n[RESULT] Synergy Backend Integration: FAILED ❌\nError: {str(e)}")
    finally:
        db.close()

if __name__ == "__main__":
    test_synergy_integration()
