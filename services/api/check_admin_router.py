import sys
sys.path.append('.')
import routers.admin
import asyncio

async def test():
    # Unfortunately we need to mock a bit, or just inspect the router
    for route in routers.admin.router.routes:
        if route.path == '/users':
            print(route.endpoint)
            # The endpoint depends on DB and user.
            
test()
