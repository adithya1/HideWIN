import sqlite3  
conn=sqlite3.connect('hidewin.db')  
conn.execute(\" UPDATE app_settings SET setting_value=gemini-flash-latest WHERE "setting_key=fast_tier_model\)  
conn.commit()  
