import sys, asyncio
import httpx

KEY = "Bearer AQ.Ab8RN6KBKJqmt6_YdpAW6FQtUrM5KiKQU6kDw64L_8V-hYv8oA"

async def test():
    async with httpx.AsyncClient() as client:
        model = "gemini-flash-latest"
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:streamGenerateContent?alt=sse&key={KEY}"
        payload = {"contents": [{"parts": [{"text": "Say hi"}]}]}
        
        try:
            res = await client.post(url, json=payload, timeout=10)
            print(f"URL Key -> {res.status_code}")
            print(res.text[:300])
        except Exception as e:
            print(f"Error: {e}")

asyncio.run(test())
