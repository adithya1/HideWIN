import os
p = r"C:\Users\akula\Downloads\Hide-WIN - Copy\hidewin-fastapi\main.py"
with open(p, "r", encoding="utf-8") as f:
    text = f.read()

# Replace "ice_candidate" with "candidate" or check for both
text = text.replace('msg["type"] == "ice_candidate"', 'msg["type"] in ["ice_candidate", "candidate"]')
with open(p, "w", encoding="utf-8") as f:
    f.write(text)
print("Updated backend to support both candidate string formats!")
