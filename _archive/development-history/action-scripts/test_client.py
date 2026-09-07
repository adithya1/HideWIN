from fastapi.testclient import TestClient
from main import app
from routers.auth import get_current_user
import models

def override_get_user():
    user = models.User(id=1, email="admin@hidewin.com", role="ADMIN")
    return user

app.dependency_overrides[get_current_user] = override_get_user

client = TestClient(app)
response = client.get("/api/admin/users")
print("Status:", response.status_code)
print("Response:", response.text)
