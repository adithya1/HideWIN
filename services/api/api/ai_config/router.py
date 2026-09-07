from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
import httpx
import json

from services.api.core.database import get_db
from services.api.db_models.ai_config import AiProviderKey
from services.api.api.transcription.admin import encrypt_key, decrypt_key

router = APIRouter(prefix="/admin/llm", tags=["admin-llm"])

class KeyCreate(BaseModel):
    provider: str
    api_key_value: str
    enabled_models: list[str] = []

class KeyFetch(BaseModel):
    provider: str
    api_key_value: str

@router.post("/fetch-models")
async def fetch_models(payload: KeyFetch):
    provider = payload.provider.lower()
    api_key = payload.api_key_value

    async with httpx.AsyncClient() as client:
        try:
            if provider == "groq":
                resp = await client.get("https://api.groq.com/openai/v1/models", headers={"Authorization": f"Bearer {api_key}"})
                data = resp.json().get("data", [])
                return {"status": "success", "models": [m["id"] for m in data]}
            elif provider == "openai":
                resp = await client.get("https://api.openai.com/v1/models", headers={"Authorization": f"Bearer {api_key}"})
                data = resp.json().get("data", [])
                return {"status": "success", "models": [m["id"] for m in data if "gpt" in m["id"] or "o1" in m["id"]]}
            elif provider == "deepseek":
                resp = await client.get("https://api.deepseek.com/models", headers={"Authorization": f"Bearer {api_key}"})
                data = resp.json().get("data", [])
                return {"status": "success", "models": [m["id"] for m in data]}
            elif provider == "gemini":
                resp = await client.get(f"https://generativelanguage.googleapis.com/v1beta/models?key={api_key}")
                data = resp.json().get("models", [])
                return {"status": "success", "models": [m["name"].replace("models/", "") for m in data]}
            elif provider == "anthropic":
                return {"status": "success", "models": ["claude-3-5-sonnet-20240620", "claude-3-opus-20240229", "claude-3-haiku-20240307", "claude-2.1"]}
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))
            
    return {"status": "success", "models": []}

@router.get("/keys")
async def list_keys(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(AiProviderKey))
    keys = result.scalars().all()
    out = []
    for k in keys:
        try:
            enabled_models = json.loads(k.enabled_models or "[]")
        except:
            enabled_models = []
            
        # We need to decrypt to show the hint if the legacy didn't save hint properly,
        # but the model actually stores it in api_key_value. Wait, legacy saved it plaintext!
        # For security, we should enforce encryption.
        val = decrypt_key(k.api_key_value) if k.api_key_value and len(k.api_key_value) > 50 else k.api_key_value
        hint = "***" + val[-4:] if val else ""
        
        out.append({
            "id": k.id,
            "provider": k.provider,
            "api_key_value": hint,
            "enabled_models": enabled_models,
            "is_enabled": getattr(k, 'is_enabled', True)
        })
    return {"keys": out}

@router.post("/keys")
async def save_key(payload: KeyCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(AiProviderKey).filter_by(provider=payload.provider))
    existing = result.scalars().first()
    
    models_json = json.dumps(payload.enabled_models)
    enc_val = encrypt_key(payload.api_key_value)
    
    if existing:
        existing.api_key_value = enc_val
        existing.enabled_models = models_json
    else:
        new_key = AiProviderKey(
            provider=payload.provider,
            api_key_value=enc_val,
            enabled_models=models_json,
            is_enabled=True
        )
        db.add(new_key)
        
    await db.commit()
    return {"status": "success"}
