import os

cal = r"C:\Users\akula\Downloads\Hide-WIN\hidewin-fastapi\src\api\user\calendar.py"
with open(cal, "r") as f:
    content = f.read()

content = content.replace("router = APIRouter(prefix=\"/api/calendar\", tags=[\"calendar\"])\n\n    return {", "router = APIRouter(prefix=\"/api/calendar\", tags=[\"calendar\"])\n\n@router.get(\"/events\")\ndef get_events():\n    return {")
with open(cal, "w") as f:
    f.write(content)
print("Patched calendar.py syntax error")
