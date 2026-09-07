import re

path = r'C:\Users\akula\Downloads\Hide-WIN - Copy\hidewin-fastapi\routers\user.py'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add prompt to RemoteControlEvent
if 'prompt: str = ""' not in content:
    content = content.replace('key: str = ""', 'key: str = ""\n    prompt: str = ""')

# Replace handle_remote_control
old_func = """@router.post("/remote-control")
def handle_remote_control(event: RemoteControlEvent):
    try:
        import pyautogui
        pyautogui.FAILSAFE = False # Prevent stopping if mouse goes to corner during remote control
        
        # Calculate absolute coordinates
        screen_width, screen_height = pyautogui.size()
        abs_x = int(event.x * screen_width)
        abs_y = int(event.y * screen_height)
        
        if event.type == "mousemove":
            pyautogui.moveTo(abs_x, abs_y)
        elif event.type == "mousedown":
            pyautogui.mouseDown(x=abs_x, y=abs_y)
        elif event.type == "mouseup":
            pyautogui.mouseUp(x=abs_x, y=abs_y)
        elif event.type == "click":
            pyautogui.click(x=abs_x, y=abs_y)
        elif event.type == "keydown":
            pyautogui.keyDown(event.key)
        elif event.type == "keyup":
            pyautogui.keyUp(event.key)
            
        return {"status": "success"}
    except Exception as e:
        import traceback
        print("Remote Control Error:", e)
        traceback.print_exc()
        return {"status": "error", "message": str(e)}"""

new_func = """@router.post("/remote-control")
async def handle_remote_control(event: RemoteControlEvent, db: Session = Depends(get_db)):
    try:
        import pyautogui
        pyautogui.FAILSAFE = False
        
        if event.type == "screenshot_and_analyze":
            import base64
            from io import BytesIO
            from groq import AsyncGroq
            import db_models as models
            
            # 1. Take Screenshot
            img = pyautogui.screenshot()
            
            # Optional scroll and capture logic could go here
            
            # Compress and encode
            buffered = BytesIO()
            img.convert("RGB").save(buffered, format="JPEG", quality=50)
            img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
            
            # 2. Get Groq API Key
            key_record = db.query(models.APIKey).filter(models.APIKey.provider == "groq", models.APIKey.is_active == True).first()
            if not key_record:
                return {"status": "error", "message": "No Groq API key configured in database."}
                
            # 3. Call AI Vision Model
            client = AsyncGroq(api_key=key_record.api_key_value)
            
            prompt_text = event.prompt if event.prompt else "Analyze this screenshot and explain what is happening on the screen. Be concise and helpful."
            
            response = await client.chat.completions.create(
                model="llama-3.2-11b-vision-preview",
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": prompt_text},
                            {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{img_str}"}}
                        ]
                    }
                ],
                max_tokens=500
            )
            answer = response.choices[0].message.content
            return {"status": "success", "answer": answer}
            
        else:
            # Calculate absolute coordinates
            screen_width, screen_height = pyautogui.size()
            abs_x = int(event.x * screen_width)
            abs_y = int(event.y * screen_height)
            
            if event.type == "mousemove":
                pyautogui.moveTo(abs_x, abs_y)
            elif event.type == "mousedown":
                pyautogui.mouseDown(x=abs_x, y=abs_y)
            elif event.type == "mouseup":
                pyautogui.mouseUp(x=abs_x, y=abs_y)
            elif event.type == "click":
                pyautogui.click(x=abs_x, y=abs_y)
            elif event.type == "keydown":
                pyautogui.keyDown(event.key)
            elif event.type == "keyup":
                pyautogui.keyUp(event.key)
                
            return {"status": "success"}
    except Exception as e:
        import traceback
        print("Remote Control Error:", e)
        traceback.print_exc()
        return {"status": "error", "message": str(e)}"""

if old_func in content:
    content = content.replace(old_func, new_func)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Patched handle_remote_control")
else:
    print("Could not find old_func to patch")
