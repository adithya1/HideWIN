import pytest
import numpy as np
from unittest.mock import AsyncMock, patch, MagicMock

from services.api.services.stt_service import (
    STTServiceFactory, 
    LocalTranscriber, 
    GroqTranscriber,
    transcribe_audio_chunk
)
from services.api.core.config import settings

def test_factory_returns_groq_if_key_set(monkeypatch):
    monkeypatch.setattr(settings, "GROQ_API_KEY", "fake_key")
    # Patch the groq import so it doesn't try to load real credentials
    with patch("services.api.services.stt_service.AsyncGroq") as mock_groq:
        transcriber = STTServiceFactory.get_transcriber()
        assert isinstance(transcriber, GroqTranscriber)
        mock_groq.assert_called_once_with(api_key="fake_key")

def test_factory_returns_local_if_no_key(monkeypatch):
    monkeypatch.setattr(settings, "GROQ_API_KEY", "")
    with patch("services.api.services.stt_service.LocalTranscriber.__init__", return_value=None):
        transcriber = STTServiceFactory.get_transcriber()
        assert isinstance(transcriber, LocalTranscriber)

def test_transcribe_audio_chunk_logic():
    mock_model = MagicMock()
    
    # Mock segment object
    class MockSegment:
        def __init__(self, text):
            self.text = text
            
    mock_segments = [MockSegment(" Hello "), MockSegment("world. ")]
    mock_info = MagicMock()
    mock_model.transcribe.return_value = (mock_segments, mock_info)
    
    # Dummy audio data
    dummy_np = np.zeros(10, dtype=np.float32)
    
    text = transcribe_audio_chunk(mock_model, dummy_np)
    
    assert text == "Hello world."
    mock_model.transcribe.assert_called_once_with(
        dummy_np,
        beam_size=5,
        language="en",
        condition_on_previous_text=False
    )
