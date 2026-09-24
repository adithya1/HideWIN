import os

p = r"C:\Users\akula\Downloads\Hide-WIN - Copy\hidewin-fastapi\routers\user.py"
with open(p, "r", encoding="utf-8") as f:
    text = f.read()

endpoint = """
from pydantic import BaseModel
class RemoteControlEvent(BaseModel):
    type: str
    x: float = 0.0
    y: float = 0.0
    key: str = ""

@router.post("/remote-control")
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
        traceback.print_exc()
        return {"status": "error", "message": str(e)}
"""

if "/remote-control" not in text:
    text = text + "\n" + endpoint
    with open(p, "w", encoding="utf-8") as f:
        f.write(text)
    print("Injected remote control endpoint into user.py!")
else:
    print("Already injected!")
