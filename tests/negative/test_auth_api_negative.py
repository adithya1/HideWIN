import pytest
from fastapi.testclient import TestClient
from services.api.main import app

client = TestClient(app)

# We can't hit the real DB easily in basic unit tests without overriding dependencies.
# We will use dependency_overrides to mock get_db.

from services.api.core.database import get_db
from unittest.mock import AsyncMock

async def override_get_db():
    yield AsyncMock()

app.dependency_overrides[get_db] = override_get_db

def test_signup_missing_fields():
    response = client.post("/auth/signup", json={"email": "bad"})
    assert response.status_code == 422 # Validation Error from Pydantic
