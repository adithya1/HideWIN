import re

p = r"c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js"
with open(p, "r", encoding="utf-8") as f:
    text = f.read()

# Find invite in nav
idx = text.find("invite")
while idx >= 0:
    snippet = text[max(0,idx-100):idx+100]
    if "nav" in snippet.lower() or "menu" in snippet.lower() or "tab" in snippet.lower() or "icon" in snippet.lower() or "click" in snippet.lower():
        print(f"--- At {idx} ---")
        print(snippet)
    idx = text.find("invite", idx+1)

# Also look for the nav bar rendering
idx2 = text.find("renderTopToolbar")
if idx2 >= 0:
    print("\n--- renderTopToolbar found at", idx2)
    print(text[idx2:idx2+500])
