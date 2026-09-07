import asyncio
import websockets

async def test():
    try:
        async with websockets.connect('ws://127.0.0.1:9000/ws/signaling/host/TEST') as ws:
            print("Connected to 9000!")
    except Exception as e:
        print(f"Failed 9000: {e}")
        
    try:
        async with websockets.connect('ws://127.0.0.1:8000/ws/signaling/host/TEST') as ws:
            print("Connected to 8000!")
    except Exception as e:
        print(f"Failed 8000: {e}")

asyncio.run(test())
