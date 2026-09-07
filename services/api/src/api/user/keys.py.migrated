from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
import httpx
import json

from src.lib.database import get_db
import db_models as models

router = APIRouter(prefix="/api/admin-keys", tags=["Key Manager"])

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
                # Anthropic doesn't have a standard models endpoint in the same way, return static known models
                return {"status": "success", "models": ["claude-3-5-sonnet-20240620", "claude-3-opus-20240229", "claude-3-haiku-20240307", "claude-2.1"]}
                
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))
            
    return {"status": "success", "models": []}


@router.get("")
def list_keys(db: Session = Depends(get_db)):
    keys = db.query(models.AiProviderKey).all()
    result = []
    for k in keys:
        try:
            enabled_models = json.loads(k.enabled_models or "[]")
        except:
            enabled_models = []
            
        result.append({
            "id": k.id,
            "provider": k.provider,
            "api_key_value": "***" + k.api_key_value[-4:] if k.api_key_value else "",
            "enabled_models": enabled_models,
            "is_enabled": k.is_enabled
        })
    return {"keys": result}

@router.post("")
def save_key(payload: KeyCreate, db: Session = Depends(get_db)):
    existing = db.query(models.AiProviderKey).filter_by(
        provider=payload.provider,
        api_key_value=payload.api_key_value
    ).first()
    
    models_json = json.dumps(payload.enabled_models)
    
    if existing:
        existing.enabled_models = models_json
    else:
        new_key = models.AiProviderKey(
            provider=payload.provider,
            api_key_value=payload.api_key_value,
            enabled_models=models_json,
            is_enabled=True
        )
        db.add(new_key)
        
    db.commit()
    return {"status": "success"}
