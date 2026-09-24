from groq import AsyncGroq
import asyncio
import os

async def test_groq_vision():
    # We will try to mock an API request to see if the library version supports vision format.
    print(AsyncGroq.__version__)
    
try:
    import groq
    print("Groq version:", getattr(groq, '__version__', 'unknown'))
except Exception as e:
    print(e)
