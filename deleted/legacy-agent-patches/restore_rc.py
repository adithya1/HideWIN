import os

p = r"C:\Users\akula\Downloads\Hide-WIN - Copy\hidewin-fastapi\routers\user.py"
with open(p, "r", encoding="utf-8") as f:
    text = f.read()

definition = """from pydantic import BaseModel
class RemoteControlEvent(BaseModel):
    type: str
    x: float = 0.0
    y: float = 0.0
    key: str = ""

@router.post("/remote-control")"""

text = text.replace('@router.post("/remote-control")', definition)

with open(p, "w", encoding="utf-8") as f:
    f.write(text)
print("Restored RemoteControlEvent class definition!")
