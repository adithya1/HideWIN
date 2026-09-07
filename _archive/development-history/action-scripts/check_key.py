import sys, json, hmac, hashlib, asyncio
sys.path.append('.')
import httpx

# Test if the Gemini API key format is valid (should start with AIza)
KEY = "AQ.Ab8RN6JiyZEOJ5Tdb0TVc7IyPvJD4gtynOF9J1O43_BS6gVIdg"
print("Key starts with AIza:", KEY.startswith("AIza"))
print("Key length:", len(KEY))
print("Key format looks like:", "VALID (AIza...)" if KEY.startswith("AIza") else "INVALID - Not a standard Gemini API key!")
print()
print("A valid Gemini API key should:")
print("  - Start with 'AIza'")
print("  - Be ~39 characters long")
print("  - Obtained from: https://aistudio.google.com/app/apikey")
