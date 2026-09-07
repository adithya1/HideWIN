from fastapi import APIRouter, Depends, HTTPException, Request, UploadFile, File
from groq import AsyncGroq
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from services.api.core.database import get_db
from services.api.core.redis import redis_manager
from services.api import db_models as models
import hmac
import hashlib
import json
import httpx
import random
import asyncio
import logging

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/api/ai-proxy",
    tags=["AI Proxy"]
)

HMAC_SECRET = "hw_desktop_secret_998877"

def get_model_and_provider_for_tier(tier: str, db: Session):
    setting_key = "high_tier_model" if tier == "premium" else "fast_tier_model"
    setting = db.query(models.AppSetting).filter(models.AppSetting.setting_key == setting_key).first()
    model_val = setting.setting_value if setting else ("gpt-4o" if tier == "premium" else "gemini-flash-latest")
    
    if "gpt" in model_val:
        return "openai", model_val
    elif "gemini" in model_val or "flash-latest" in model_val:
        return "gemini", model_val
    elif "claude" in model_val:
        return "claude", model_val
    elif "deepseek" in model_val:
        return "deepseek", model_val
    elif "llama" in model_val or "gsk" in model_val or "mixtral" in model_val:
        return "groq", model_val
    else:
        return "custom", model_val

def get_active_keys_for_provider(provider: str, db: Session, model_name: str = None):
    keys = db.query(models.AiProviderKey).filter(
        models.AiProviderKey.provider == provider,
        models.AiProviderKey.is_enabled == True
    ).all()
    
    if not model_name:
        return keys
        
    valid_keys = []
    for k in keys:
        try:
            enabled_models = json.loads(k.enabled_models or "[]")
            if model_name in enabled_models or not enabled_models:
                valid_keys.append(k)
        except:
            valid_keys.append(k) # Fallback to true if JSON is invalid
            
    return valid_keys

def verify_hmac(request: Request, body_bytes: bytes):
    signature = request.headers.get("X-HideWin-Signature")
    if not signature:
        raise HTTPException(status_code=401, detail="Missing signature")
    expected_sig = hmac.new(HMAC_SECRET.encode(), body_bytes, hashlib.sha256).hexdigest()
    if not hmac.compare_digest(signature, expected_sig):
        raise HTTPException(status_code=401, detail="Invalid signature")

async def attempt_generation_with_keys(keys, provider, model_name, prompt, system_instruction):
    last_error = "No keys available"
    async with httpx.AsyncClient() as client:
        # Simple round-robin / shuffle
        random.shuffle(keys)
        for key_record in keys:
            try:
                if provider == "gemini":
                    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={key_record.api_key_value}"
                    payload = {"contents": [{"parts": [{"text": prompt}]}]}
                    if system_instruction: payload["system_instruction"] = {"parts": [{"text": system_instruction}]}
                    res = await client.post(url, json=payload, timeout=60.0)
                    if res.status_code in [429, 500, 502, 503, 401]:
                        last_error = f"Gemini API {res.status_code}"
                        continue
                    res.raise_for_status()
                    return {"text": res.json()["candidates"][0]["content"]["parts"][0]["text"], "provider": provider, "model": model_name}
                elif provider in ["groq", "deepseek"]:
                    base_url = "https://api.groq.com/openai/v1" if provider == "groq" else "https://api.deepseek.com/v1"
                    url = f"{base_url}/chat/completions"
                    headers = {"Authorization": f"Bearer {key_record.api_key_value}", "Content-Type": "application/json"}
                    messages = []
                    if system_instruction:
                        messages.append({"role": "system", "content": system_instruction})
                    messages.append({"role": "user", "content": prompt})
                    payload = {"model": model_name, "messages": messages}
                    res = await client.post(url, headers=headers, json=payload, timeout=60.0)
                    if res.status_code in [429, 500, 502, 503, 401]:
                        last_error = f"{provider.capitalize()} API {res.status_code}"
                        continue
                    res.raise_for_status()
                    return {"text": res.json()["choices"][0]["message"]["content"], "provider": provider, "model": model_name}
                else:
                    raise HTTPException(status_code=501, detail="Provider not implemented for generate")
            except Exception as e:
                last_error = str(e)
                continue
    raise Exception(f"All keys failed for {provider}. Last error: {last_error}")

@router.post("/generate")
async def generate_text(request: Request, db: Session = Depends(get_db)):
    body_bytes = await request.body()
    verify_hmac(request, body_bytes)
    try: body = json.loads(body_bytes)
    except: raise HTTPException(status_code=400, detail="Invalid JSON")
    
    prompt = body.get("prompt")
    tier = body.get("tier")
    explicit_model = body.get("model_name")
    system_instruction = body.get("system_instruction", "")

    if explicit_model:
        provider = "groq"
        model_name = explicit_model
        keys = get_active_keys_for_provider(provider, db, model_name)
    else:
        # Loosely coupled multi-model routing
        provider = "groq"
        all_keys = get_active_keys_for_provider(provider, db)
        keys = []
        import random
        # Collect all keys that have at least one enabled model
        for k in all_keys:
            try:
                models_list = json.loads(k.enabled_models or "[]")
                # Filter models based on tier heuristic
                if tier == "premium":
                    tier_models = [m for m in models_list if "70" in m or "32" in m or "4" in m]
                else:
                    tier_models = [m for m in models_list if "8b" in m or "instant" in m or "flash" in m or "mini" in m]
                
                if tier_models:
                    model_name = random.choice(tier_models)
                    keys.append(k)
                elif models_list:
                    model_name = random.choice(models_list)
                    keys.append(k)
            except:
                pass
        
        if not keys and all_keys:
            keys = all_keys
            model_name = "llama-3.1-8b-instant" # Fallback if no models checked
    if keys:
        import random
        random.shuffle(keys)
        try:
            return await attempt_generation_with_keys(keys, provider, model_name, prompt, system_instruction)
        except Exception as e:
            logger.warning(f"Primary provider {provider} failed: {e}. Attempting fallback.")
    
    # Attempt fallback provider
    fallback_provider, fallback_model = get_model_and_provider_for_tier("fast", db)
    fallback_keys = get_active_keys_for_provider(fallback_provider, db, fallback_model)
    
    if fallback_keys:
        import random
        random.shuffle(fallback_keys)
        try:
            return await attempt_generation_with_keys(fallback_keys, fallback_provider, fallback_model, prompt, system_instruction)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Fallback provider {fallback_provider} also failed: {e}")
            
    raise HTTPException(status_code=503, detail="No active keys available for primary or fallback.")


@router.post("/stream")
async def stream_text(request: Request, db: Session = Depends(get_db)):
    body_bytes = await request.body()
    verify_hmac(request, body_bytes)
    
    try: body = json.loads(body_bytes)
    except Exception: raise HTTPException(status_code=400, detail="Invalid JSON body")
        
    contents = body.get("contents")
    tier = body.get("tier", "fast")
    
    if not contents: raise HTTPException(status_code=400, detail="Missing contents array")

    provider, model_name = get_model_and_provider_for_tier(tier, db)
    keys = get_active_keys_for_provider(provider, db, model_name)
    if not keys: raise HTTPException(status_code=503, detail="No active keys available.")

    import random
    random.shuffle(keys)
    # Example gemini content: {"role": "user", "parts": [{"text": "hello"}]}
    messages = []
    for c in contents:
        role = c.get("role", "user")
        text = c.get("parts", [{}])[0].get("text", "")
        if role == "model": role = "assistant"
        messages.append({"role": role, "content": text})

    async def openai_compatible_streamer(key_record, base_url):
        url = f"{base_url}/chat/completions"
        headers = {"Authorization": f"Bearer {key_record.api_key_value}", "Content-Type": "application/json"}
        payload = {"model": model_name, "messages": messages, "stream": True}
        
        async with httpx.AsyncClient() as client:
            try:
                async with client.stream('POST', url, headers=headers, json=payload, timeout=120.0) as response:
                    if response.status_code != 200:
                        error_text = await response.aread()
                        yield f"data: {{\"error\": \"API Error: {response.status_code} {error_text.decode('utf-8', errors='ignore')}\"}}\n\n"
                        return
                        
                    async for chunk in response.aiter_lines():
                        if chunk.startswith("data: "):
                            data_str = chunk[6:]
                            if data_str == "[DONE]":
                                break
                            try:
                                data = json.loads(data_str)
                                content = data["choices"][0].delta.get("content", "")
                                if content:
                                    # Format it like Gemini so the frontend doesn't break
                                    yield f"data: {json.dumps({'candidates': [{'content': {'parts': [{'text': content}]}}]})}\n\n"
                            except:
                                pass
            except httpx.TimeoutException:
                yield f"data: {{\"error\": \"API timed out after 120 seconds.\"}}\n\n"
            except Exception as e:
                yield f"data: {{\"error\": \"API proxy error: {str(e)}\"}}\n\n"

    async def gemini_streamer(key_record):
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:streamGenerateContent?alt=sse&key={key_record.api_key_value}"
        payload = {"contents": contents}
        async with httpx.AsyncClient() as client:
            try:
                async with client.stream('POST', url, json=payload, timeout=120.0) as response:
                    if response.status_code != 200:
                        error_text = await response.aread()
                        yield f"data: {{\"error\": \"Google API Error: {response.status_code} {error_text.decode('utf-8', errors='ignore')}\"}}\n\n"
                        return
                    async for chunk in response.aiter_text():
                        yield chunk
            except httpx.TimeoutException:
                yield f"data: {{\"error\": \"Google API timed out after 120 seconds.\"}}\n\n"
            except Exception as e:
                yield f"data: {{\"error\": \"Google API proxy error: {str(e)}\"}}\n\n"

    # Streaming failover is harder due to generator nature. Just picking random for now.
    key_record = random.choice(keys)
    
    if provider == "gemini":
        return StreamingResponse(gemini_streamer(key_record), media_type="text/event-stream")
    elif provider == "deepseek":
        return StreamingResponse(openai_compatible_streamer(key_record, "https://api.deepseek.com/v1"), media_type="text/event-stream")
    elif provider == "groq":
        return StreamingResponse(openai_compatible_streamer(key_record, "https://api.groq.com/openai/v1"), media_type="text/event-stream")
    else:
        raise HTTPException(status_code=501, detail="Streaming for this provider is not yet implemented")


@router.post("/stream-audio-to-llm")
async def stream_audio_to_llm(request: Request, file: UploadFile = File(...), db: Session = Depends(get_db)):
    audio_bytes = await file.read()
    stt_model = request.headers.get("X-STT-Model")
    
    groq_keys_objs = get_active_keys_for_provider('groq', db, stt_model)
    if not groq_keys_objs:
        raise HTTPException(status_code=500, detail="No active Groq API keys available")

    # Serialize keys for Redis Manager
    available_keys = [{"id": k.id, "api_key_value": k.api_key_value, "enabled_models": k.enabled_models} for k in groq_keys_objs]
    
    max_retries = 3
    
    import json
    import random
    import groq
    from services.api.core.redis import redis_manager
    
    # Try up to 3 keys if we hit 429 Rate Limits
    for attempt in range(max_retries):
        selected_key = await redis_manager.get_healthy_key('groq', available_keys)
        if not selected_key:
            raise HTTPException(status_code=429, detail="All Groq keys are currently rate-limited (429). Try again later.")
            
        groq_api_key = selected_key['api_key_value']
        
        # Determine STT Model
        current_stt_model = stt_model
        if not current_stt_model:
            try:
                models_list = json.loads(selected_key['enabled_models'] or "[]")
                whisper_models = [m for m in models_list if "whisper" in m]
                if whisper_models:
                    current_stt_model = random.choice(whisper_models)
            except:
                pass
        if not current_stt_model:
            current_stt_model = "whisper-large-v3-turbo"
            
        client = AsyncGroq(api_key=groq_api_key)
        
        try:
            # 1. STT Phase
            transcription = await client.audio.transcriptions.create(
                file=("speech.wav", audio_bytes),
                model=current_stt_model,
                response_format="text",
                temperature=0.0
            )
            
            prompt_text = transcription.strip()
            if not prompt_text:
                async def empty_generator(): yield ""
                return StreamingResponse(empty_generator(), media_type="text/plain")
                
            print(f"[Composite Proxy] Selected Key ID {selected_key['id']} STT: '{prompt_text}'")
            
            # Log usage in Token Bucket
            await redis_manager.log_key_usage('groq', selected_key['id'])
            
            # 2. LLM Streaming Phase
            async def token_stream_generator():
                try:
                    response = await client.chat.completions.create(
                        model="llama-3.1-8b-instant",
                        messages=[
                            {"role": "system", "content": "You are a helpful assistant. Give concise answers."},
                            {"role": "user", "content": prompt_text}
                        ],
                        temperature=0.6,
                        max_tokens=300,
                        stream=True
                    )
                    async for chunk in response:
                        if chunk.choices and chunk.choices[0].delta.content:
                            yield chunk.choices[0].delta.content
                except Exception as e:
                    print(f"Streaming Error: {e}")
                    yield f"\n[Error: {e}]"
            
            return StreamingResponse(token_stream_generator(), media_type="text/plain")
            
        except (groq.RateLimitError, groq.APIStatusError) as e:
            err_code = getattr(e, 'status_code', 500)
            if err_code in [429, 502, 503]:
                print(f"Groq Error {err_code} on Key ID {selected_key['id']}! Marking as exhausted in Redis...")
                await redis_manager.mark_key_exhausted('groq', selected_key['id'])
                if attempt == max_retries - 1:
                    raise HTTPException(status_code=429, detail="API exhausted across multiple fallback keys.")
                continue # Try next key
            else:
                raise HTTPException(status_code=err_code, detail=str(e))
                
        except Exception as e:
            print(f"Unknown Groq Error: {e}")
            raise HTTPException(status_code=500, detail=str(e))
