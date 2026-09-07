import asyncio
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import logging

from services.api.core.config import settings
from services.api.services.stt_service import STTServiceFactory
from services.api.services.vad_service import VoiceActivityService
from services.api.schemas.ws_schema import TranscriptionResponse

router = APIRouter(prefix="/ws", tags=["WebSockets"])
logger = logging.getLogger(__name__)

@router.websocket("/transcribe")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    logger.info("[WS] Client connected. Initializing audio pipeline...")
    
    try:
        transcriber = STTServiceFactory.get_transcriber()
    except Exception as e:
        logger.error(f"[WS] Error loading transcriber: {e}")
        await websocket.close(code=1011, reason="STT Engine Unavailable")
        return

    vad = VoiceActivityService(
        is_groq=bool(settings.GROQ_API_KEY)
    )

    try:
        while True:
            data = await websocket.receive_bytes()
            if not data:
                continue

            partial_bytes, final_bytes = vad.process_chunk(data)

            # Handle partial transcription (in-progress speech)
            if partial_bytes:
                async def do_partial(buf):
                    try:
                        text = await transcriber.transcribe(buf)
                        if text:
                            resp = TranscriptionResponse(transcript=text, is_final=False)
                            await websocket.send_json(resp.model_dump())
                    except Exception as e:
                        logger.warning(f"[WS] Partial transcript error: {e}")
                
                # Fire and forget partials so we don't block incoming audio streaming
                asyncio.create_task(do_partial(partial_bytes))

            # Handle final transcription (silence detected)
            if final_bytes:
                try:
                    text = await transcriber.transcribe(final_bytes)
                    if text:
                        resp = TranscriptionResponse(transcript=text, is_final=True)
                        await websocket.send_json(resp.model_dump())
                except Exception as e:
                    logger.error(f"[WS] Final transcript error: {e}")

    except WebSocketDisconnect:
        logger.info("[WS] Client disconnected cleanly.")
    except Exception as e:
        logger.error(f"[WS] Unexpected error: {e}")
    finally:
        transcriber.close()
