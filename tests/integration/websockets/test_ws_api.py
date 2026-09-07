import pytest
import json
from fastapi.testclient import TestClient
from unittest.mock import patch, AsyncMock

from services.api.main import app

# We use the standard TestClient to test WebSocket connections
client = TestClient(app)

def test_websocket_transcribe_lifecycle():
    # We patch the factory to return a dummy transcriber so we don't load AI models in tests
    mock_transcriber = AsyncMock()
    mock_transcriber.transcribe.return_value = "Hello world"
    
    with patch("services.api.routers.ws.STTServiceFactory.get_transcriber", return_value=mock_transcriber):
        with client.websocket_connect("/ws/transcribe") as websocket:
            
            # 1. Send some dummy bytes that represent "speech"
            # We need to bypass the VAD logic for a simple WS test, 
            # so we mock the VAD service to immediately return a final chunk
            with patch("services.api.routers.ws.VoiceActivityService.process_chunk", return_value=(None, b"fake_audio_bytes")):
                websocket.send_bytes(b"dummy_incoming_bytes")
                
                # 2. Receive the JSON response
                data = websocket.receive_json()
                
                # 3. Assert the JSON schema contract is correct
                assert data["transcript"] == "Hello world"
                assert data["is_final"] is True
                
                # Verify the transcriber was actually called with the bytes yielded by the VAD
                mock_transcriber.transcribe.assert_called_with(b"fake_audio_bytes")
                
            # Disconnect
            websocket.close()
            
        # Verify cleanup was called on disconnect
        mock_transcriber.close.assert_called_once()
