import sys, asyncio
sys.path.append('.')
import httpx

KEY = "AQ.Ab8RN6KBKJqmt6_YdpAW6FQtUrM5KiKQU6kDw64L_8V-hYv8oA"

async def test():
    async with httpx.AsyncClient() as client:
        # Try with X-goog-api-key header (as the curl shows) and gemini-flash-latest
        url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent"
        payload = {"contents": [{"parts": [{"text": "Say hello in 5 words"}]}]}
        
        # Method 1: X-goog-api-key header
        res = await client.post(url, json=payload, headers={"X-goog-api-key": KEY}, timeout=15)
        print("Header method - Status:", res.status_code)
        print("Response:", res.text[:400])
        print()
        
        # Method 2: ?key= param  
        res2 = await client.post(url + f"?key={KEY}", json=payload, timeout=15)
        print("Query param method - Status:", res2.status_code)
        print("Response:", res2.text[:400])

asyncio.run(test())
