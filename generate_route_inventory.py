import os
import sys

sys.path.insert(0, "c:/Users/akula/Downloads/Hide-WIN")

from services.api.main import app

openapi = app.openapi()
print(f"{'METHOD':<15} {'PATH':<50}")
print("-" * 65)

for path, path_item in openapi.get("paths", {}).items():
    for method, operation in path_item.items():
        print(f"{method.upper():<15} {path:<50}")
        
# For WebSockets, which are not in OpenAPI, we can use app.router.routes but handle _IncludedRouter
for route in app.routes:
    if type(route).__name__ == "_IncludedRouter":
        # Check original_router routes for websockets
        if hasattr(route, "original_router") and hasattr(route.original_router, "routes"):
            for subroute in route.original_router.routes:
                from fastapi.routing import APIWebSocketRoute
                if isinstance(subroute, APIWebSocketRoute):
                    # In newer FastAPI included_router prefix is in include_context but let's try getting path
                    print(f"{'WS':<15} {subroute.path:<50}")
    else:
        from fastapi.routing import APIWebSocketRoute
        if isinstance(route, APIWebSocketRoute):
            print(f"{'WS':<15} {route.path:<50}")
