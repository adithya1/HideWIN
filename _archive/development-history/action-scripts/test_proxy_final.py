import sys, json, hmac, hashlib, asyncio
sys.path.append('.')
import httpx

HMAC_SECRET = "hw_desktop_secret_998877"

async def test():
    body = {"prompt": "Say hello in 5 words", "tier": "fast"}
    body_bytes = json.dumps(body).encode()
    sig = hmac.new(HMAC_SECRET.encode(), body_bytes, hashlib.sha256).hexdigest()
    
    async with httpx.AsyncClient() as client:
        res = await client.post(
            "http://localhost:8000/api/ai-proxy/generate",
            content=body_bytes,
            headers={"Content-Type": "application/json", "X-HideWin-Signature": sig},
            timeout=30
        )
        print("Status:", res.status_code)
        print("Response:", res.text[:400])

asyncio.run(test())
