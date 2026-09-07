import asyncio
import websockets

async def test_ws():
    uri = "ws://127.0.0.1:8000/ws/signaling/host/HW-TEST"
    try:
        async with websockets.connect(uri) as websocket:
            print("Connected successfully!")
            response = await websocket.recv()
            print("Received:", response)
    except Exception as e:
        print("Failed:", e)

asyncio.run(test_ws())
