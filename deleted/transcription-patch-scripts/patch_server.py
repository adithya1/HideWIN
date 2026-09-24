import re

filepath = r"c:\Users\akula\Downloads\Hide-WIN\whisper-server\server.py"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# Add a background task for partials inside the websocket_endpoint
pattern = r"SILENCE_THRESHOLD = 500.*?while True:"

replacement = """SILENCE_THRESHOLD = 500  # RMS threshold for silence vs speaking
    CHUNKS_TO_WAIT = 15      # Number of silent frames to trigger transcription
    silence_counter = 0
    is_speaking = False
    
    # Track when we last emitted a partial to avoid spamming
    last_partial_size = 0
    
    try:
        while True:"""

content = re.sub(pattern, replacement, content, flags=re.DOTALL)

pattern2 = r"if rms > SILENCE_THRESHOLD:.*?else:"

replacement2 = """if rms > SILENCE_THRESHOLD:
                is_speaking = True
                silence_counter = 0
                audio_buffer.extend(resampled)
                
                # Emit word-by-word partials every ~0.5 seconds of new speech
                if len(audio_buffer) - last_partial_size > (16000 * 0.5):
                    last_partial_size = len(audio_buffer)
                    # Offload partial generation so it doesn't block incoming audio
                    async def do_partial(buf):
                        try:
                            text = await transcriber.transcribe(buf)
                            if text:
                                await websocket.send_json({"transcript": text, "is_final": False})
                        except Exception:
                            pass
                    asyncio.create_task(do_partial(bytes(audio_buffer)))
            else:"""

content = re.sub(pattern2, replacement2, content, flags=re.DOTALL)

# Reset last_partial_size when a final phrase is sent
pattern3 = r"# Reset for the next spoken phrase\s*audio_buffer\.clear\(\)\s*is_speaking = False"
replacement3 = """# Reset for the next spoken phrase
                        audio_buffer.clear()
                        is_speaking = False
                        last_partial_size = 0"""

content = re.sub(pattern3, replacement3, content, flags=re.DOTALL)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
print("server.py patched for partial streaming.")
