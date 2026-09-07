import sys, os, sqlite3
sys.path.append('.')
from passlib.context import CryptContext

# Check what Gemini key is stored
conn = sqlite3.connect('hidewin.db')
c = conn.cursor()

c.execute("SELECT * FROM ai_provider_keys")
keys = c.fetchall()
print("=== AI Provider Keys ===")
c.execute("PRAGMA table_info(ai_provider_keys)")
cols = [col[1] for col in c.fetchall()]
print("Columns:", cols)
c.execute("SELECT * FROM ai_provider_keys")
for row in c.fetchall():
    print(dict(zip(cols, row)))

print()
c.execute("SELECT * FROM app_settings")
settings = c.fetchall()
c.execute("PRAGMA table_info(app_settings)")
scols = [col[1] for col in c.fetchall()]
print("=== App Settings ===")
c.execute("SELECT * FROM app_settings")
for row in c.fetchall():
    print(dict(zip(scols, row)))

conn.close()
