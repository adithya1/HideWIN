import sys, asyncio
sys.path.append('.')
import httpx

KEY = "AQ.Ab8RN6KBKJqmt6_YdpAW6FQtUrM5KiKQU6kDw64L_8V-hYv8oA"

async def test():
    async with httpx.AsyncClient() as client:
        # Let's test the main models Google recommends for this key type
        models = [
            "gemini-1.5-pro", 
            "gemini-1.5-flash", 
            "gemini-2.5-pro",
            "gemini-2.0-flash", 
            "gemini-1.0-pro"
        ]
        
        print("Testing models with X-goog-api-key...")
        for model in models:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
            payload = {"contents": [{"parts": [{"text": "Say hi"}]}]}
            try:
                res = await client.post(url, json=payload, headers={"X-goog-api-key": KEY}, timeout=10)
                print(f"{model:20} -> {res.status_code}")
                if res.status_code == 200:
                    print("  SUCCESS!")
                elif res.status_code not in (404, 503):
                    print(f"  {res.text[:100]}")
            except Exception as e:
                print(f"{model:20} -> Error: {e}")

asyncio.run(test())
