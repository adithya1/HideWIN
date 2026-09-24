import asyncio
import websockets

async def test_ws():
    uri = "ws://127.0.0.1:8000/ws/signaling/host/HW-TEST-1234"
    try:
        async with websockets.connect(uri) as ws:
            print("Connected successfully!")
            msg = await ws.recv()
            print(f"Received: {msg}")
    except Exception as e:
        print(f"Failed to connect: {e}")

asyncio.run(test_ws())
