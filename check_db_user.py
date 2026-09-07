import sqlite3
import json

conn = sqlite3.connect(r'C:\Users\akula\Downloads\Hide-WIN\hidewin-fastapi\src\lib\hidewin.db')
c = conn.cursor()
c.execute("SELECT id, host_id, title FROM meetings")
rows = c.fetchall()
for r in rows:
    print(r)
    
c.execute("SELECT id, email FROM users")
print("Users:", c.fetchall())
conn.close()
