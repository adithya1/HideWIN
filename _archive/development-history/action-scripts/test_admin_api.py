from fastapi.testclient import TestClient
from main import app
from routers.auth import get_current_user
import models

def override_get_user():
    return models.User(id=1, email="admin@hidewin.com", role="ADMIN")

app.dependency_overrides[get_current_user] = override_get_user

client = TestClient(app)
res = client.get("/api/admin/users")
print(res.status_code)
print(res.text)
