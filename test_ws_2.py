import asyncio
import websockets

async def test():
    try:
        async with websockets.connect('ws://127.0.0.1:9000/ws/signaling/host/TEST') as ws:
            print("Connected!")
            msg = await ws.recv()
            print("Received:", msg)
    except Exception as e:
        print(f"Failed: {e}")

asyncio.run(test())
