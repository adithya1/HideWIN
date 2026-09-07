import os
from cryptography.fernet import Fernet
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from services.api.core.database import get_db
from services.api.db_models.ai_config import SttProviderKey

# Need a persistent key for Fernet, ideally from env, but mock for now
SECRET = b'KzQ7H9Vv0nB-8P3mYgX9r_k6G6x5W1FhV9M7aU0vSWM='
cipher = Fernet(SECRET)

def encrypt_key(raw: str) -> str:
    if not raw: return ""
    return cipher.encrypt(raw.encode()).decode()

def decrypt_key(enc: str) -> str:
    if not enc: return ""
    try: return cipher.decrypt(enc.encode()).decode()
    except: return ""

class SttConfigCreate(BaseModel):
    provider_name: str
    mode: str
    api_key: Optional[str] = None
    custom_url: Optional[str] = None
    custom_name: Optional[str] = None
    is_enabled: bool = True
    is_active: bool = False
    priority: int = 10
    buffer_seconds: float = 1.0

router = APIRouter(prefix="/admin/stt", tags=["admin-stt"])

@router.get("/config")
async def get_stt_config(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(SttProviderKey).order_by(SttProviderKey.priority))
    providers = result.scalars().all()
    return {
        "configs": [
            {
                "id": p.id,
                "provider_name": p.provider_name,
                "mode": p.mode,
                "key_hint": p.key_hint or "",
                "custom_url": p.custom_url or "",
                "custom_name": p.custom_name or p.provider_name,
                "is_enabled": p.is_enabled,
                "is_active": p.is_active,
                "priority": p.priority,
                "buffer_seconds": p.buffer_seconds,
            }
            for p in providers
        ]
    }

@router.post("/config")
async def save_stt_config(cfg: SttConfigCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(SttProviderKey).filter(SttProviderKey.provider_name == cfg.provider_name))
    existing = result.scalars().first()
    
    if cfg.is_active:
        # Simplistic update for active flag
        all_res = await db.execute(select(SttProviderKey))
        for p in all_res.scalars().all():
            p.is_active = False
            
    if existing:
        existing.mode = cfg.mode
        existing.is_enabled = cfg.is_enabled
        existing.is_active = cfg.is_active
        existing.priority = cfg.priority
        existing.buffer_seconds = cfg.buffer_seconds
        if cfg.custom_url is not None: existing.custom_url = cfg.custom_url
        if cfg.custom_name is not None: existing.custom_name = cfg.custom_name
        if cfg.api_key and not cfg.api_key.startswith("****"):
            existing.encrypted_key = encrypt_key(cfg.api_key)
            existing.key_hint = "****" + cfg.api_key[-4:] if len(cfg.api_key) >= 4 else "****"
    else:
        hint = "****" + cfg.api_key[-4:] if (cfg.api_key and len(cfg.api_key) >= 4) else "****"
        enc = encrypt_key(cfg.api_key) if cfg.api_key else None
        new_p = SttProviderKey(
            provider_name=cfg.provider_name, mode=cfg.mode,
            encrypted_key=enc, key_hint=hint,
            custom_url=cfg.custom_url, custom_name=cfg.custom_name,
            is_enabled=cfg.is_enabled, is_active=cfg.is_active,
            priority=cfg.priority, buffer_seconds=cfg.buffer_seconds
        )
        db.add(new_p)
    
    await db.commit()
    return {"status": "saved"}
