"""
migrate_stt_v2.py
Migrates the stt_provider_keys table to the new schema.
Safe to run multiple times (uses ALTER TABLE ... IF NOT EXISTS pattern via try/except).
"""
import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "hidewin.db")
conn = sqlite3.connect(DB_PATH)
c = conn.cursor()

new_columns = [
    ("mode",           "TEXT DEFAULT 'local_ws'"),
    ("encrypted_key",  "TEXT"),
    ("key_hint",       "TEXT"),
    ("custom_name",    "TEXT"),
    ("priority",       "INTEGER DEFAULT 1"),
    ("buffer_seconds", "INTEGER DEFAULT 3"),
    ("updated_at",     "TEXT"),
]

for col_name, col_def in new_columns:
    try:
        c.execute(f"ALTER TABLE stt_provider_keys ADD COLUMN {col_name} {col_def}")
        print(f"[+] Added column: {col_name}")
    except sqlite3.OperationalError as e:
        if "duplicate column" in str(e).lower():
            print(f"[=] Already exists: {col_name}")
        else:
            raise

# Migrate old api_key_value → encrypted_key if present
try:
    c.execute("SELECT id, api_key_value FROM stt_provider_keys WHERE api_key_value IS NOT NULL AND encrypted_key IS NULL")
    rows = c.fetchall()
    if rows:
        import sys
        sys.path.insert(0, os.path.dirname(__file__))
        from utils.crypto import encrypt_key, mask_key
        for row_id, raw_key in rows:
            enc = encrypt_key(raw_key)
            hint = mask_key(raw_key)
            c.execute("UPDATE stt_provider_keys SET encrypted_key=?, key_hint=? WHERE id=?", (enc, hint, row_id))
            print(f"[~] Migrated key for row id={row_id}")
except Exception as e:
    print(f"[!] Key migration note: {e}")

conn.commit()
conn.close()
print("\nMigration complete.")
