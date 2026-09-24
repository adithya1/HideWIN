import sqlite3

db_path = r'C:\Users\akula\Downloads\Hide-WIN - Copy\hidewin-fastapi\hidewin.db'
conn = sqlite3.connect(db_path)
c = conn.cursor()

c.execute("UPDATE app_settings SET setting_value = '192.168.1.15' WHERE setting_key = 'dns_ip'")
conn.commit()
print("Updated dns_ip in database to 192.168.1.15")

conn.close()
