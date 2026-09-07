import sys, asyncio
sys.path.append('.')
import httpx

KEY = "AQ.Ab8RN6KBKJqmt6_YdpAW6FQtUrM5KiKQU6kDw64L_8V-hYv8oA"

async def test():
    async with httpx.AsyncClient() as client:
        models = ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-1.5-pro", "gemini-2.5-flash"]
        for model in models:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
            payload = {"contents": [{"parts": [{"text": "Say hello"}]}]}
            res = await client.post(url, json=payload, headers={"X-goog-api-key": KEY}, timeout=15)
            print(f"{model}: {res.status_code}")
            if res.status_code == 200:
                data = res.json()
                print("  -> ", data["candidates"][0]["content"]["parts"][0]["text"][:100])
            elif res.status_code != 503:
                print("  -> ", res.text[:200])

asyncio.run(test())
