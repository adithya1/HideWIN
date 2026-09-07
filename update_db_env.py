import os

db_path = r"C:\Users\akula\Downloads\Hide-WIN\hidewin-fastapi\src\lib\database.py"
with open(db_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace hardcoded sqlite url with os.getenv
new_url_logic = """import os
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./hidewin.db")"""

content = content.replace('SQLALCHEMY_DATABASE_URL = "sqlite:///./hidewin.db"', new_url_logic)

with open(db_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated database.py to support environment variables.")
