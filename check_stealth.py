p = r"c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js"
with open(p, "r", encoding="utf-8") as f:
    lines = f.readlines()

# Check _boundStealthMove
for i, line in enumerate(lines):
    if "_boundStealthMove" in line or "set-stealth-state" in line or "fake-cursor" in line or "cursor-hidden" in line or "move-stealth-cursor" in line:
        print(f"{i+1}: {line.rstrip()[:120]}")
