import subprocess
import time
import requests
import asyncio
import websockets

# Start uvicorn
proc = subprocess.Popen(
    ["uvicorn", "main:app", "--port", "8005"],
    cwd=r"C:\Users\akula\Downloads\Hide-WIN - Copy\hidewin-fastapi",
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
    text=True
)
time.sleep(3) # wait for startup

async def test_ws():
    uri = "ws://127.0.0.1:8005/ws/signaling/host/HW-TEST"
    try:
        async with websockets.connect(uri) as websocket:
            print("Connected successfully!")
    except Exception as e:
        print("WS Failed:", e)

asyncio.run(test_ws())

proc.terminate()
stdout, stderr = proc.communicate()
print("STDOUT:", stdout)
print("STDERR:", stderr)
