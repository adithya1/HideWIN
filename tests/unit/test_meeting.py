import pytest
from fastapi.testclient import TestClient
from services.api.main import app

client = TestClient(app)

def test_meeting_routes_are_not_registered():
    """Removed meeting, guest invitation, and mock calendar routes stay unavailable."""
    response = client.get("/health")
    assert response.status_code == 200

    retired_prefixes = ("/api/meetings", "/user/meetings", "/public/meetings", "/calendar")
    active_paths = {route.path for route in app.routes if hasattr(route, "path")}
    for prefix in retired_prefixes:
        assert not any(path == prefix or path.startswith(f"{prefix}/") for path in active_paths)
