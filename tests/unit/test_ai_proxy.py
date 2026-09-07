import pytest
from fastapi.testclient import TestClient
from services.api.main import app

client = TestClient(app)

def test_ai_proxy_routes_registered():
    """Verify that the AI proxy routes are correctly mounted."""
    response = client.get("/health")
    assert response.status_code == 200
    
    # We can't easily test the /generate endpoint without a DB mock, 
    # but we can verify it returns 422 (validation error) instead of 404
    response = client.post("/api/ai-proxy/generate", json={})
    assert response.status_code == 401
