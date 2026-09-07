import pytest
from fastapi.testclient import TestClient
from services.api.main import app

client = TestClient(app)

def test_meeting_routes_registered():
    """Verify that the meeting routes are correctly mounted."""
    response = client.get("/health")
    assert response.status_code == 200
    
    # Verify the /api/meetings endpoint requires authentication (returns 401)
    response = client.get("/api/meetings")
    assert response.status_code in (401, 405)
