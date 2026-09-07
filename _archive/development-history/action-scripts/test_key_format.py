import sys, asyncio
sys.path.append('.')
import httpx

# Test the AQ. key format - see what Google says
KEY = "AQ.Ab8RN6JiyZEOJ5Tdb0TVc7IyPvJD4gtynOF9J1O43_BS6gVIdg"

async def test():
    async with httpx.AsyncClient() as client:
        # Try with v1 instead of v1beta
        url = f"https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key={KEY}"
        res = await client.post(url, json={"contents": [{"parts": [{"text": "hi"}]}]}, timeout=10)
        print("v1 Status:", res.status_code)
        print("v1 Response:", res.text[:300])

asyncio.run(test())
