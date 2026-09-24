import pytest
import json
from routers.auth import create_access_token
from models import User

def test_third_eye_agent_response(client, db_session):
    """Test the Third-Eye team AI WebSocket query flow."""
    
    # 1. Setup authorized user
    user = User(email="team-ai@test.invalid", role="USER", is_verified=True)
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    
    token = create_access_token(data={"sub": "team-ai@test.invalid", "id": user.id, "role": "USER"})
    
    # 2. Connect to the Websocket
    with client.websocket_connect(f"/ws/team/custom_room?token={token}") as websocket:
        # Send third-eye query hook
        payload = {
            "type": "third_eye_query",
            "content": "Hello Third-Eye, are you there?",
            "provider": "gemini"
        }
        websocket.send_json(payload)
        
        # Await the agent response
        data = websocket.receive_json()
        assert data["type"] == "third_eye_response"
        # Since LangChain may not have actual API keys in test environment, we fallback safely.
        # But we verify it hit the response layer successfully!
        assert "content" in data
