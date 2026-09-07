import re

filepath = r"c:\Users\akula\Downloads\Hide-WIN\whisper-server\server.py"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# Replace the blocking transcribe call inside do_partial
pattern = r"async def do_partial\(buf\):.*?try:.*?text = await transcriber\.transcribe\(buf\).*?if text:.*?await websocket\.send_json\(\{\"transcript\": text, \"is_final\": False\}\).*?except Exception:.*?pass"

replacement = """async def do_partial(buf):
                        try:
                            # Use asyncio.to_thread to run synchronous CPU-bound transcribe without blocking the WS loop
                            text = await asyncio.to_thread(transcriber.transcribe, buf)
                            if text:
                                await websocket.send_json({"transcript": text, "is_final": False})
                        except Exception as e:
                            print(f"[WS] Partial transcript error: {e}")
                            pass"""

content = re.sub(pattern, replacement, content, flags=re.DOTALL)

# Also fix the main transcribe call that runs when silence is reached
pattern2 = r"if len\(audio_buffer\) > 16000 \* 0\.5:.*?text = await transcriber\.transcribe\(bytes\(audio_buffer\)\).*?if text:"

replacement2 = """if len(audio_buffer) > 16000 * 0.5: # Require at least 0.5 seconds of audio to transcribe
                            try:
                                text = await asyncio.to_thread(transcriber.transcribe, bytes(audio_buffer))
                            except Exception as e:
                                print(f"[WS] Final transcript error: {e}")
                                text = ""
                            if text:"""

content = re.sub(pattern2, replacement2, content, flags=re.DOTALL)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
print("server.py patched with asyncio.to_thread to prevent 1011 crashes.")
