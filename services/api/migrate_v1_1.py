import sqlite3
import os

DB_PATH = 'hidewin-fastapi/hidewin.db'

def migrate():
    print(f"--- 🛠️ HIDEWIN DATABASE MIGRATION (v1.1) ---")
    if not os.path.exists(DB_PATH):
        print(f"[!] Database not found at {DB_PATH}")
        return

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        # 1. Add 'permissions' column if it doesn't exist
        cursor.execute("PRAGMA table_info(users)")
        columns = [row[1] for row in cursor.fetchall()]
        
        if 'permissions' not in columns:
            print("[+] Adding 'permissions' column to 'users' table...")
            cursor.execute("ALTER TABLE users ADD COLUMN permissions JSON DEFAULT '{}'")
            conn.commit()
            print("[✓] Migration Successful: permissions column added.")
        else:
            print("[.] Migration Skipped: permissions column already exists.")

        # 2. Check for 'google_id' index/constraint if needed (SQLite doesn't support DROP CONSTRAINT)
        # but we already removed unique=True in the model, so new users will be fine.
        
    except Exception as e:
        print(f"[!] Migration Failed: {str(e)}")
    finally:
        conn.close()

if __name__ == "__main__":
    migrate()
