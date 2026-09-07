import sys, asyncio
sys.path.append('.')
import httpx

KEY = "AQ.Ab8RN6KBKJqmt6_YdpAW6FQtUrM5KiKQU6kDw64L_8V-hYv8oA"

async def test():
    async with httpx.AsyncClient() as client:
        # Use the model suggested by Google itself: gemini-3.6-flash
        models = ["gemini-3.6-flash", "gemini-flash-latest", "gemini-2.5-flash-latest"]
        for model in models:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
            payload = {"contents": [{"parts": [{"text": "Say hello in 5 words"}]}]}
            res = await client.post(url, json=payload, headers={"X-goog-api-key": KEY}, timeout=20)
            print(f"{model}: {res.status_code}")
            if res.status_code == 200:
                data = res.json()
                print("  SUCCESS ->", data["candidates"][0]["content"]["parts"][0]["text"][:100])
            else:
                print("  ->", res.text[:200])

asyncio.run(test())
