import sys
sys.path.append('.')
from routers.auth import create_access_token
import requests
import json

# create a valid token! We need to know what 'mac' is. Wait, I can just mock get_current_user in TestClient!

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
