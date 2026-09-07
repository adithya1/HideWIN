import sqlite3

db = sqlite3.connect("hidewin.db")
db.execute("UPDATE app_settings SET setting_value='gemini-1.5-flash' WHERE setting_key='fast_tier_model'")
db.commit()
print("Fast tier model updated!")
print(db.execute("SELECT setting_value FROM app_settings WHERE setting_key='fast_tier_model'").fetchone())
db.close()
