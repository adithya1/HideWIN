import sqlite3
import os

db_path = r'C:\Users\akula\Downloads\Hide-WIN\hidewin-fastapi\hidewin.db'
if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    c = conn.cursor()
    c.execute("UPDATE app_settings SET setting_value = '192.168.1.15' WHERE setting_key = 'dns_ip'")
    conn.commit()
    print("Updated dns_ip in primary database to 192.168.1.15")
    conn.close()
