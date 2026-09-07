import sys
sys.path.append('.')
import routers.admin
print("Prefix:", routers.admin.router.prefix)
for r in routers.admin.router.routes:
    print(r.path)
