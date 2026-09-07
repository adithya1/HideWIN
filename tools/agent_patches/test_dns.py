import sys
sys.path.append(r"C:\Users\akula\Downloads\Hide-WIN - Copy\hidewin-fastapi")

from database import SessionLocal
from routers.user import get_public_dns_settings

db = SessionLocal()
try:
    print(get_public_dns_settings(db))
except Exception as e:
    import traceback
    traceback.print_exc()
finally:
    db.close()
