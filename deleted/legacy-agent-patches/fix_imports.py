import os

p = r"C:\Users\akula\Downloads\Hide-WIN - Copy\hidewin-fastapi\main.py"
with open(p, "r", encoding="utf-8") as f:
    text = f.read()

# Add imports if missing
imports = """
from fastapi import Depends
from sqlalchemy.orm import Session
from database import get_db
"""

if "from database import get_db" not in text:
    text = imports + "\n" + text
    with open(p, "w", encoding="utf-8") as f:
        f.write(text)
    print("Added DB imports to main.py")
