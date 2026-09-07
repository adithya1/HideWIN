import sys
sys.path.append('.')
import routers.admin

for r in routers.admin.router.routes:
    if '/user' in r.path:
        print(r.methods, r.path)
