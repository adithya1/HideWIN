import sys
sys.path.append('.')
import routers.admin
import asyncio
from database import SessionLocal
import models

async def main():
    db = SessionLocal()
    user = db.query(models.User).filter_by(email="admin@hidewin.com").first()
    for route in routers.admin.router.routes:
        if route.path == '/users':
            res = await route.endpoint(current_user=user, db=db)
            print("Users endpoint result:", res)
            break

asyncio.run(main())
