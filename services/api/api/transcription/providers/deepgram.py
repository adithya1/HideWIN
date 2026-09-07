import json
import asyncio
import websockets
from fastapi import WebSocket, WebSocketDisconnect

async def handle_deepgram_ws(client_ws: WebSocket, api_key: str):
    """
    Deepgram WebSocket streaming handler.
    Real-time word-by-word transcription.
    """
    dg_url = (
        "wss://api.deepgram.com/v1/listen"
        "?encoding=linear16"
        "&sample_rate=24000"
        "&channels=1"
        "&model=nova-2"
        "&punctuate=true"
        "&interim_results=true"
    )
    
    try:
        async with websockets.connect(
            dg_url,
            additional_headers={"Authorization": f"Token {api_key}"},
        ) as dg_ws:

            async def from_client():
                try:
                    while True:
                        chunk = await client_ws.receive_bytes()
                        await dg_ws.send(chunk)
                except (WebSocketDisconnect, Exception):
                    try:
                        await dg_ws.send(json.dumps({"type": "CloseStream"}))
                    except Exception:
                        pass

            async def from_deepgram():
                try:
                    async for msg in dg_ws:
                        try:
                            data = json.loads(msg)
                            alt  = data.get("channel", {}).get("alternatives", [{}])
                            text = alt[0].get("transcript", "") if alt else ""
                            is_final = data.get("is_final", False)
                            if text:
                                await client_ws.send_json({
                                    "transcript": text,
                                    "is_final":   is_final,
                                    "provider":   "deepgram"
                                })
                        except json.JSONDecodeError:
                            pass
                except Exception:
                    pass

            await asyncio.gather(from_client(), from_deepgram())
            
    except Exception as e:
        try:
            await client_ws.send_json({"error": f"Deepgram connection failed: {str(e)}"})
        except Exception:
            pass
