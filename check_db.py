import sqlite3
import json

conn = sqlite3.connect(r'C:\Users\akula\Downloads\Hide-WIN\hidewin-fastapi\src\lib\hidewin.db')
c = conn.cursor()
c.execute("SELECT id, title, status FROM meetings")
rows = c.fetchall()
print(f"Total meetings in DB: {len(rows)}")
for r in rows:
    print(r)
conn.close()
