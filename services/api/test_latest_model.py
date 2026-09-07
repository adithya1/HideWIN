import sys, asyncio
sys.path.append('.')
import httpx

KEY = "AQ.Ab8RN6KBKJqmt6_YdpAW6FQtUrM5KiKQU6kDw64L_8V-hYv8oA"

async def test():
    async with httpx.AsyncClient() as client:
        # Let's test the endpoint that the user's curl command successfully used:
        model = "gemini-flash-latest"
        
        print(f"Testing {model}...")
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
        payload = {"contents": [{"parts": [{"text": "Say hi"}]}]}
        try:
            res = await client.post(url, json=payload, headers={"X-goog-api-key": KEY}, timeout=10)
            print(f"{model:20} -> {res.status_code}")
            if res.status_code == 200:
                print("  SUCCESS!")
                print("  Response:", res.json()["candidates"][0]["content"]["parts"][0]["text"])
            else:
                print(f"  {res.text[:100]}")
        except Exception as e:
            print(f"{model:20} -> Error: {e}")

asyncio.run(test())
