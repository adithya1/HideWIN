import re

p = r"c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js"
with open(p, "r", encoding="utf-8") as f:
    text = f.read()

# Check: does the main app-shell (line 2090) have fake-cursor div inside it?
idx = text.find('<div class="app-shell" style=')
if idx >= 0:
    segment = text[idx:idx+200]
    print("Main app-shell:")
    print(segment)
    print("Has fake-cursor:", 'fake-cursor' in segment[:100])
