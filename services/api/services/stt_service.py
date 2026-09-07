import io
import wave
import asyncio
import numpy as np
import concurrent.futures
from abc import ABC, abstractmethod

from services.api.core.config import settings

def transcribe_audio_chunk(model, audio_np):
    """Runs the actual faster-whisper transcription (blocking CPU/GPU bound)."""
    segments, info = model.transcribe(
        audio_np, 
        beam_size=5, 
        language="en", 
        condition_on_previous_text=False
    )
    text = " ".join([seg.text for seg in segments]).strip()
    return text

class BaseTranscriber(ABC):
    @abstractmethod
    async def transcribe(self, audio_data: bytes) -> str:
        pass

    @abstractmethod
    def close(self):
        pass

class LocalTranscriber(BaseTranscriber):
    def __init__(self):
        try:
            from faster_whisper import WhisperModel
        except ImportError:
            raise RuntimeError("faster-whisper is not installed.")
        
        self.model = WhisperModel(
            settings.MODEL_SIZE, 
            device=settings.DEVICE, 
            compute_type=settings.COMPUTE_TYPE
        )
        # Use a dedicated thread pool to unblock the asyncio event loop
        self.executor = concurrent.futures.ThreadPoolExecutor(max_workers=1)

    async def transcribe(self, audio_data: bytes) -> str:
        audio_np = np.frombuffer(audio_data, np.int16).astype(np.float32) / 32768.0
        loop = asyncio.get_running_loop()
        text = await loop.run_in_executor(
            self.executor, 
            transcribe_audio_chunk, 
            self.model, 
            audio_np
        )
        return text

    def close(self):
        self.executor.shutdown(wait=False)
        self.model = None

class GroqTranscriber(BaseTranscriber):
    def __init__(self, api_key: str):
        try:
            from groq import AsyncGroq
        except ImportError:
            raise RuntimeError("groq is not installed.")
        
        self.client = AsyncGroq(api_key=api_key)

    async def transcribe(self, audio_data: bytes) -> str:
        wav_io = io.BytesIO()
        with wave.open(wav_io, 'wb') as wav_file:
            wav_file.setnchannels(1)
            wav_file.setsampwidth(2)
            wav_file.setframerate(16000)
            wav_file.writeframes(audio_data)
        wav_io.seek(0)
        
        try:
            transcription = await self.client.audio.transcriptions.create(
                file=("audio.wav", wav_io.read()),
                model="whisper-large-v3",
                response_format="json"
            )
            return transcription.text
        except Exception as e:
            # We log but return empty string to handle transient failures gracefully during live WS
            print(f"[Groq Error] {e}")
            return ""

    def close(self):
        # Groq client doesn't need explicit shutdown in the same way, but implemented for interface consistency
        pass

class STTServiceFactory:
    @staticmethod
    def get_transcriber() -> BaseTranscriber:
        if settings.GROQ_API_KEY:
            return GroqTranscriber(api_key=settings.GROQ_API_KEY)
        return LocalTranscriber()
