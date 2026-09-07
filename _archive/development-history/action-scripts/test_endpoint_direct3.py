import sys
sys.path.append('.')
import routers.admin
import asyncio
from database import SessionLocal
import models
import inspect

async def main():
    db = SessionLocal()
    for route in routers.admin.router.routes:
        if route.path.endswith('/users'):
            print("Args:", inspect.signature(route.endpoint))
            res = route.endpoint(db=db)
            if inspect.iscoroutine(res):
                res = await res
            print("Users endpoint result:", res)

asyncio.run(main())
