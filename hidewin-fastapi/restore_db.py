import sqlite3

db_path = r"c:\Users\akula\Downloads\Hide-WIN\hidewin-fastapi\hidewin.db"
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Restore Gemini as the fast tier model
cursor.execute("UPDATE app_settings SET setting_value = 'gemini-flash-latest' WHERE setting_key = 'fast_tier_model'")

conn.commit()
conn.close()
print("Database restored to Gemini.")
