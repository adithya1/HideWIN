from fastapi import APIRouter, WebSocket, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from services.api.core.database import get_db
from services.api.db_models.ai_config import SttProviderKey
from services.api.api.transcription.admin import decrypt_key
from services.api.api.transcription.providers.deepgram import handle_deepgram_ws
import logging

logger = logging.getLogger(__name__)
router = APIRouter(tags=["transcription"])

@router.websocket("/stream")
async def stt_stream(websocket: WebSocket, db: AsyncSession = Depends(get_db)):
    await websocket.accept()
    
    result = await db.execute(select(SttProviderKey).filter(SttProviderKey.is_enabled == True).order_by(SttProviderKey.priority))
    providers = result.scalars().all()
    
    if not providers:
        logger.info("[STT] No provider configured")
        await websocket.send_json({"error": "No STT provider configured."})
        await websocket.close()
        return
        
    p = providers[0]  # Grab the highest priority provider
    
    if p.mode == "deepgram_ws":
        api_key = decrypt_key(p.encrypted_key or "")
        if not api_key:
            await websocket.send_json({"error": "Deepgram API key missing or invalid."})
            await websocket.close()
            return
        await handle_deepgram_ws(websocket, api_key)
    else:
        # Fallback or other providers not yet ported in this demo step
        await websocket.send_json({"error": f"Provider mode {p.mode} not supported over WS yet."})
        await websocket.close()
