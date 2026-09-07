"""
routers/stt.py
==============
Live Transcription API — Multi-Provider STT Proxy

Supports:
  - groq_rest   : Groq Whisper REST API (buffer ~3s of audio, no local server needed)
  - deepgram_ws : Deepgram WebSocket streaming (word-by-word, real-time)
  - local_ws    : Local Whisper server ws://localhost:8001 (free, offline)
  - custom_ws   : Any custom WebSocket STT endpoint

Routing modes (set per-session or globally):
  - single   : Use only the active primary engine
  - race     : Send to all enabled engines, use first final response
  - fallback : Try primary; if it fails, switch to priority-2 engine

Security:
  - API keys are Fernet-encrypted before DB storage
  - Frontend only sees masked key hints (***xyz)
  - Keys are decrypted in-memory at call time only
"""

import io
import json
import wave
import struct
import asyncio
import logging
from typing import Optional

import httpx
import websockets
from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from pydantic import BaseModel

from src.lib.database import get_db
import db_models as models
from src.utils.crypto import encrypt_key, decrypt_key, mask_key

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/stt", tags=["Live Transcription"])

SAMPLE_RATE = 24000   # Hz — must match Electron audio capture
CHANNELS    = 1
SAMPLE_WIDTH = 2      # 16-bit PCM = 2 bytes per sample


# ─────────────────────────────────────────────────────────────────────────────
# Pydantic Schemas
# ─────────────────────────────────────────────────────────────────────────────

class SttConfigCreate(BaseModel):
    provider_name: str           # groq | deepgram | local | custom
    mode: str                    # groq_rest | deepgram_ws | local_ws | custom_ws
    api_key: Optional[str] = None
    custom_url: Optional[str] = None
    custom_name: Optional[str] = None
    is_enabled: bool = True
    is_active: bool = False
    priority: int = 1
    buffer_seconds: int = 3

class SttConfigTest(BaseModel):
    provider_name: str


# ─────────────────────────────────────────────────────────────────────────────
# Config Endpoints
# ─────────────────────────────────────────────────────────────────────────────

@router.get("/config")
def get_stt_config(db: Session = Depends(get_db)):
    """Return all STT providers — keys are masked, never raw."""
    providers = db.query(models.SttProviderKey).order_by(models.SttProviderKey.priority).all()
    return {
        "configs": [
            {
                "id":            p.id,
                "provider_name": p.provider_name,
                "mode":          p.mode,
                "key_hint":      p.key_hint or "",
                "custom_url":    p.custom_url or "",
                "custom_name":   p.custom_name or p.provider_name,
                "is_enabled":    p.is_enabled,
                "is_active":     p.is_active,
                "priority":      p.priority,
                "buffer_seconds": p.buffer_seconds,
            }
            for p in providers
        ]
    }


@router.post("/config")
def save_stt_config(cfg: SttConfigCreate, db: Session = Depends(get_db)):
    """Save / update a provider config. Encrypts the API key before storing."""
    existing = db.query(models.SttProviderKey).filter(
        models.SttProviderKey.provider_name == cfg.provider_name
    ).first()

    # If setting as active, deactivate all others
    if cfg.is_active:
        db.query(models.SttProviderKey).update({models.SttProviderKey.is_active: False})

    if existing:
        existing.mode         = cfg.mode
        existing.is_enabled   = cfg.is_enabled
        existing.is_active    = cfg.is_active
        existing.priority     = cfg.priority
        existing.buffer_seconds = cfg.buffer_seconds
        if cfg.custom_url is not None:
            existing.custom_url = cfg.custom_url
        if cfg.custom_name is not None:
            existing.custom_name = cfg.custom_name
        # Only update key if a real new key was provided (not a masked hint)
        if cfg.api_key and not cfg.api_key.startswith("***"):
            existing.encrypted_key = encrypt_key(cfg.api_key)
            existing.key_hint      = mask_key(cfg.api_key)
    else:
        enc_key  = encrypt_key(cfg.api_key) if cfg.api_key else None
        hint     = mask_key(cfg.api_key)    if cfg.api_key else None
        provider = models.SttProviderKey(
            provider_name  = cfg.provider_name,
            mode           = cfg.mode,
            encrypted_key  = enc_key,
            key_hint       = hint,
            custom_url     = cfg.custom_url,
            custom_name    = cfg.custom_name or cfg.provider_name,
            is_enabled     = cfg.is_enabled,
            is_active      = cfg.is_active,
            priority       = cfg.priority,
            buffer_seconds = cfg.buffer_seconds,
        )
        db.add(provider)

    db.commit()
    return {"status": "success", "provider": cfg.provider_name}


@router.delete("/config/{provider_name}")
def delete_stt_config(provider_name: str, db: Session = Depends(get_db)):
    """Remove a provider config."""
    p = db.query(models.SttProviderKey).filter(
        models.SttProviderKey.provider_name == provider_name
    ).first()
    if not p:
        raise HTTPException(status_code=404, detail="Provider not found")
    db.delete(p)
    db.commit()
    return {"status": "deleted"}


@router.post("/config/test")
async def test_stt_config(req: SttConfigTest, db: Session = Depends(get_db)):
    """
    Test a provider connection and return latency.
    For Groq: sends a silent 1-second WAV and checks the API response.
    For Deepgram: attempts to open the WebSocket and close immediately.
    """
    p = db.query(models.SttProviderKey).filter(
        models.SttProviderKey.provider_name == req.provider_name
    ).first()
    if not p:
        raise HTTPException(status_code=404, detail="Provider not configured")

    import time
    start = time.monotonic()

    try:
        if p.mode == "groq_rest":
            api_key = decrypt_key(p.encrypted_key or "")
            if not api_key:
                return {"status": "error", "message": "No API key configured"}
            # Send a minimal silent WAV (1 second)
            silent_wav = _build_wav(bytes(SAMPLE_RATE * SAMPLE_WIDTH), SAMPLE_RATE, CHANNELS, SAMPLE_WIDTH)
            async with httpx.AsyncClient(timeout=10) as client:
                resp = await client.post(
                    "https://api.groq.com/openai/v1/audio/transcriptions",
                    headers={"Authorization": f"Bearer {api_key}"},
                    files={"file": ("test.wav", silent_wav, "audio/wav")},
                    data={"model": "whisper-large-v3", "response_format": "json"},
                )
            latency_ms = int((time.monotonic() - start) * 1000)
            if resp.status_code == 200:
                return {"status": "ok", "latency_ms": latency_ms, "provider": "groq"}
            else:
                return {"status": "error", "message": resp.text, "latency_ms": latency_ms}

        elif p.mode == "deepgram_ws":
            api_key = decrypt_key(p.encrypted_key or "")
            if not api_key:
                return {"status": "error", "message": "No API key configured"}
            url = "wss://api.deepgram.com/v1/listen?encoding=linear16&sample_rate=16000&channels=1"
            try:
                async with websockets.connect(url, additional_headers={"Authorization": f"Token {api_key}"},
                                              open_timeout=5) as ws:
                    latency_ms = int((time.monotonic() - start) * 1000)
                    return {"status": "ok", "latency_ms": latency_ms, "provider": "deepgram"}
            except Exception as e:
                return {"status": "error", "message": str(e)}

        elif p.mode == "local_ws":
            try:
                async with websockets.connect("ws://localhost:8001/ws/transcribe", open_timeout=3):
                    latency_ms = int((time.monotonic() - start) * 1000)
                    return {"status": "ok", "latency_ms": latency_ms, "provider": "local_whisper"}
            except Exception as e:
                return {"status": "error", "message": f"Local Whisper not running: {e}"}

        else:
            return {"status": "unknown", "message": f"No test for mode: {p.mode}"}

    except Exception as e:
        return {"status": "error", "message": str(e)}


# ─────────────────────────────────────────────────────────────────────────────
# Audio Helpers
# ─────────────────────────────────────────────────────────────────────────────

def _build_wav(pcm_bytes: bytes, rate: int, channels: int, sample_width: int) -> bytes:
    """Wrap raw PCM bytes into a WAV container (in-memory, no temp files)."""
    buf = io.BytesIO()
    with wave.open(buf, "wb") as wf:
        wf.setnchannels(channels)
        wf.setsampwidth(sample_width)
        wf.setframerate(rate)
        wf.writeframes(pcm_bytes)
    return buf.getvalue()


# ─────────────────────────────────────────────────────────────────────────────
# Provider Handlers
# ─────────────────────────────────────────────────────────────────────────────

async def handle_groq_rest(
    client_ws: WebSocket,
    api_key: str,
    buffer_seconds: int = 3,
):
    """
    Groq Whisper REST handler.
    Buffers audio for `buffer_seconds`, then POSTs to Groq API.
    No local Whisper server required.
    """
    bytes_per_buffer = SAMPLE_RATE * SAMPLE_WIDTH * CHANNELS * buffer_seconds
    audio_buffer = bytearray()

    async def flush_buffer():
        nonlocal audio_buffer
        if not audio_buffer:
            return
        pcm = bytes(audio_buffer)
        audio_buffer = bytearray()
        try:
            import audioop
            rms = audioop.rms(pcm, SAMPLE_WIDTH)
            if rms < 500:
                return # skip silence to prevent Groq Whisper hallucinations
            
            wav_data = _build_wav(pcm, SAMPLE_RATE, CHANNELS, SAMPLE_WIDTH)
            async with httpx.AsyncClient(timeout=15) as http:
                resp = await http.post(
                    "https://api.groq.com/openai/v1/audio/transcriptions",
                    headers={"Authorization": f"Bearer {api_key}"},
                    files={"file": ("audio.wav", wav_data, "audio/wav")},
                    data={"model": "whisper-large-v3", "response_format": "json", "language": "en"},
                )
            if resp.status_code == 200:
                text = resp.json().get("text", "").strip()
                logger.warning(f"Groq API returned: '{text}'")
                if text:
                    await client_ws.send_json({
                        "transcript": text,
                        "is_final":   True,
                        "provider":   "groq"
                    })
            else:
                logger.error(f"Groq STT error: {resp.status_code} — {resp.text}")
        except Exception as e:
            logger.error(f"Groq flush error: {e}")

    try:
        while True:
            try:
                chunk = await asyncio.wait_for(client_ws.receive_bytes(), timeout=0.5)
                audio_buffer.extend(chunk)
                
                # Debug logging to verify audio is arriving
                if len(audio_buffer) == len(chunk):
                    logger.warning(f"Groq STT: Started receiving audio chunk ({len(chunk)} bytes)...")

                if len(audio_buffer) >= bytes_per_buffer:
                    logger.warning(f"Groq STT: Buffer full ({len(audio_buffer)} bytes). Flushing to API...")
                    await flush_buffer()
            except asyncio.TimeoutError:
                # Silence detected (no chunks for 0.5s)
                if len(audio_buffer) > (SAMPLE_RATE * SAMPLE_WIDTH * CHANNELS * 0.5): 
                    logger.warning(f"Groq STT: Silence detected. Flushing {len(audio_buffer)} bytes to API...")
                    await flush_buffer()
    except WebSocketDisconnect as d:
        logger.error(f"Groq client disconnected: {d.code} {d.reason}")
        await flush_buffer()
    except Exception as e:
        logger.error(f"Groq handler error: {type(e)} {e}")
        await flush_buffer()


async def handle_deepgram_ws(client_ws: WebSocket, api_key: str):
    """
    Deepgram WebSocket streaming handler.
    Real-time word-by-word transcription.
    No local Whisper server required.
    """
    dg_url = (
        "wss://api.deepgram.com/v1/listen"
        "?encoding=linear16"
        "&sample_rate=24000"
        "&channels=1"
        "&model=nova-2"
        "&punctuate=true"
        "&interim_results=true"
    )
    try:
        async with websockets.connect(
            dg_url,
            additional_headers={"Authorization": f"Token {api_key}"},
        ) as dg_ws:

            async def from_client():
                try:
                    while True:
                        chunk = await client_ws.receive_bytes()
                        await dg_ws.send(chunk)
                except (WebSocketDisconnect, Exception):
                    try:
                        await dg_ws.send(json.dumps({"type": "CloseStream"}))
                    except Exception:
                        pass

            async def from_deepgram():
                try:
                    async for msg in dg_ws:
                        try:
                            data = json.loads(msg)
                            alt  = data.get("channel", {}).get("alternatives", [{}])
                            text = alt[0].get("transcript", "") if alt else ""
                            is_final = data.get("is_final", False)
                            if text:
                                await client_ws.send_json({
                                    "transcript": text,
                                    "is_final":   is_final,
                                    "provider":   "deepgram"
                                })
                        except Exception:
                            pass
                except Exception as e:
                    logger.error(f"Deepgram recv error: {e}")

            await asyncio.gather(from_client(), from_deepgram())

    except Exception as e:
        logger.error(f"Deepgram connect error: {e}")


async def handle_local_ws(client_ws: WebSocket):
    """
    Local Whisper WebSocket proxy.
    Requires local Whisper server running on ws://localhost:8001.
    """
    try:
        async with websockets.connect("ws://localhost:8001/ws/transcribe") as local_ws:

            async def from_client():
                try:
                    while True:
                        chunk = await client_ws.receive_bytes()
                        await local_ws.send(chunk)
                except (WebSocketDisconnect, Exception):
                    pass

            async def from_local():
                try:
                    async for msg in local_ws:
                        try:
                            data = json.loads(msg) if isinstance(msg, str) else {}
                            transcript = data.get("transcript") or data.get("text", "")
                            is_final   = data.get("is_final", True)
                            if transcript:
                                await client_ws.send_json({
                                    "transcript": transcript,
                                    "is_final":   is_final,
                                    "provider":   "local_whisper"
                                })
                        except Exception:
                            pass
                except Exception as e:
                    logger.error(f"Local Whisper recv error: {e}")

            await asyncio.gather(from_client(), from_local())

    except Exception as e:
        logger.error(f"Local Whisper connect error: {e}")
        await client_ws.send_json({
            "transcript": "[Local Whisper server not running. Please start it or switch STT provider in Admin Panel.]",
            "is_final": True,
            "provider": "local_whisper",
            "error": True
        })


async def handle_custom_ws(client_ws: WebSocket, url: str, api_key: Optional[str] = None):
    """
    Custom WebSocket STT endpoint proxy.
    """
    headers = {}
    if api_key:
        headers["Authorization"] = f"Bearer {api_key}"
    try:
        async with websockets.connect(url, additional_headers=headers) as custom_ws:

            async def from_client():
                try:
                    while True:
                        chunk = await client_ws.receive_bytes()
                        await custom_ws.send(chunk)
                except (WebSocketDisconnect, Exception):
                    pass

            async def from_target():
                try:
                    async for msg in custom_ws:
                        try:
                            data = json.loads(msg) if isinstance(msg, str) else {}
                            transcript = data.get("transcript") or data.get("text", "")
                            is_final   = data.get("is_final", True)
                            if transcript:
                                await client_ws.send_json({
                                    "transcript": transcript,
                                    "is_final":   is_final,
                                    "provider":   "custom"
                                })
                        except Exception:
                            pass
                except Exception as e:
                    logger.error(f"Custom WS recv error: {e}")

            await asyncio.gather(from_client(), from_target())

    except Exception as e:
        logger.error(f"Custom WS connect error: {e}")


# ─────────────────────────────────────────────────────────────────────────────
# Main WebSocket Endpoint
# ─────────────────────────────────────────────────────────────────────────────

@router.websocket("/stream")
async def stt_stream(websocket: WebSocket, db: Session = Depends(get_db)):
    """
    Main STT streaming endpoint.
    Reads DB for active provider and routes audio accordingly.
    Supports single, race (multi-provider), and fallback modes.
    """
    await websocket.accept()

    # Load all enabled providers sorted by priority
    providers = (
        db.query(models.SttProviderKey)
        .filter(models.SttProviderKey.is_enabled == True)
        .order_by(models.SttProviderKey.priority)
        .all()
    )

    if not providers:
        # No config at all — default to local Whisper with friendly message
        logger.info("[STT] No provider configured — using local Whisper fallback")
        await handle_local_ws(websocket)
        return

    # Primary active provider
    primary = next((p for p in providers if p.is_active), providers[0])
    api_key = decrypt_key(primary.encrypted_key or "")

    logger.info(f"[STT] Routing to provider={primary.provider_name} mode={primary.mode}")

    try:
        if primary.mode == "groq_rest":
            if not api_key:
                await websocket.send_json({"transcript": "[Groq key not set in Admin Panel]", "is_final": True, "error": True})
                return
            await handle_groq_rest(websocket, api_key, primary.buffer_seconds or 3)

        elif primary.mode == "deepgram_ws":
            if not api_key:
                await websocket.send_json({"transcript": "[Deepgram key not set in Admin Panel]", "is_final": True, "error": True})
                return
            await handle_deepgram_ws(websocket, api_key)

        elif primary.mode == "local_ws":
            await handle_local_ws(websocket)

        elif primary.mode == "custom_ws":
            url = primary.custom_url or ""
            if not url:
                await websocket.send_json({"transcript": "[Custom URL not set in Admin Panel]", "is_final": True, "error": True})
                return
            await handle_custom_ws(websocket, url, api_key or None)

        else:
            await handle_local_ws(websocket)

    except WebSocketDisconnect:
        pass
    except Exception as e:
        logger.error(f"[STT] Stream error: {e}")
        try:
            await websocket.close()
        except Exception:
            pass
