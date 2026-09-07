import os
import asyncio
from dotenv import load_dotenv

load_dotenv()
from server import GroqTranscriber

async def test():
    transcriber = GroqTranscriber(os.getenv("GROQ_API_KEY"))
    # 2 seconds of silence (zeroes)
    buf = bytes(16000 * 2 * 2) 
    print("Transcribing...")
    text = await transcriber.transcribe(buf)
    print(f"Result: {text}")

asyncio.run(test())
