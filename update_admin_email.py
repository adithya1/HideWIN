import sys
sys.path.append(r"C:\Users\akula\Downloads\Hide-WIN\hidewin-fastapi")

from src.lib.database import SessionLocal
from db_models import User

db = SessionLocal()
admin = db.query(User).filter(User.email == "admin").first()
if admin:
    admin.email = "admin@hidewin.com"
    db.commit()
    print("Changed admin email to admin@hidewin.com")
