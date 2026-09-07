import os
import io
import wave
import asyncio
import audioop
import numpy as np
import concurrent.futures
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from dotenv import load_dotenv

load_dotenv()

MODEL_SIZE = os.getenv("MODEL_SIZE", "base.en")
DEVICE = os.getenv("DEVICE", "auto")
COMPUTE_TYPE = os.getenv("COMPUTE_TYPE", "default")
PORT = int(os.getenv("PORT", 8001))
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")

app = FastAPI(title="Whisper STT Server (Local + Groq)")

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

class LocalTranscriber:
    def __init__(self):
        print(f"[Session] Initializing dedicated Local WhisperModel: {MODEL_SIZE} on {DEVICE}")
        from faster_whisper import WhisperModel
        self.model = WhisperModel(MODEL_SIZE, device=DEVICE, compute_type=COMPUTE_TYPE)
        self.executor = concurrent.futures.ThreadPoolExecutor(max_workers=1)

    async def transcribe(self, audio_data: bytes):
        audio_np = np.frombuffer(audio_data, np.int16).astype(np.float32) / 32768.0
        loop = asyncio.get_running_loop()
        text = await loop.run_in_executor(self.executor, transcribe_audio_chunk, self.model, audio_np)
        return text

    def close(self):
        print("[Session] Closing Local WhisperModel instance.")
        self.executor.shutdown(wait=False)
        del self.model

class GroqTranscriber:
    def __init__(self, api_key):
        print("[Session] Initializing Groq Cloud STT (whisper-large-v3)")
        from groq import AsyncGroq
        self.client = AsyncGroq(api_key=api_key)

    async def transcribe(self, audio_data: bytes):
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
            print(f"[Groq Error] {e}")
            return ""

    def close(self):
        print("[Session] Closing Groq STT session.")

@app.websocket("/ws/transcribe")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("[WS] Client connected. Spawning dedicated instance...")
    
    try:
        if GROQ_API_KEY:
            transcriber = GroqTranscriber(GROQ_API_KEY)
        else:
            transcriber = LocalTranscriber()
    except Exception as e:
        print(f"[WS] Error loading transcriber: {e}")
        await websocket.close()
        return

    resample_state = None
    audio_buffer = bytearray()
    
    SILENCE_THRESHOLD = 30  
    CHUNKS_TO_WAIT = 5      
    silence_counter = 0
    is_speaking = False
    last_partial_size = 0
    
    PARTIAL_THRESHOLD = (16000 * 1.5) if GROQ_API_KEY else (16000 * 0.5)

    try:
        while True:
            data = await websocket.receive_bytes()
            if not data:
                continue

            try:
                resampled, resample_state = audioop.ratecv(data, 2, 1, 24000, 16000, resample_state)
            except Exception as e:
                print(f"[WS] Resample error: {e}")
                continue

            rms = audioop.rms(resampled, 2)
            
            if rms > SILENCE_THRESHOLD:
                is_speaking = True
                silence_counter = 0
                audio_buffer.extend(resampled)
                
                if len(audio_buffer) - last_partial_size > PARTIAL_THRESHOLD:
                    last_partial_size = len(audio_buffer)
                    async def do_partial(buf):
                        try:
                            text = await transcriber.transcribe(buf)
                            if text:
                                await websocket.send_json({"transcript": text, "is_final": False})
                        except Exception as e:
                            print(f"[WS] Partial transcript error: {e}")
                    asyncio.create_task(do_partial(bytes(audio_buffer)))
            else:
                if is_speaking:
                    silence_counter += 1
                    audio_buffer.extend(resampled)
                    
                    if silence_counter > CHUNKS_TO_WAIT:
                        if len(audio_buffer) > 16000 * 0.5:
                            try:
                                text = await transcriber.transcribe(bytes(audio_buffer))
                            except Exception as e:
                                print(f"[WS] Final transcript error: {e}")
                                text = ""
                            if text:
                                print(f"[WS] Transcribed: {text}")
                                await websocket.send_json({
                                    "transcript": text,
                                    "is_final": True
                                })
                        
                        audio_buffer.clear()
                        is_speaking = False
                        last_partial_size = 0
                        silence_counter = 0

    except WebSocketDisconnect:
        print("[WS] Client disconnected.")
    except Exception as e:
        print(f"[WS] Unexpected error: {e}")
    finally:
        transcriber.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host=os.getenv("HOST", "0.0.0.0"), port=PORT, reload=False)
