p = r"c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js"
with open(p, "r", encoding="utf-8") as f:
    text = f.read()

print("File size:", len(text))
print("fake-cursor div count:", text.count('class="fake-cursor"'))
print("app-shell div count:", text.count('class="app-shell"'))
print("cursor-hidden count:", text.count("cursor-hidden"))
print("set-stealth-state count:", text.count("set-stealth-state"))

# Check for syntax issue - the bracket was never closed for set-stealth-state 
import re
m = re.search(r'ipcRenderer\.on\(\'set-stealth-state\'.*?\}\);', text, re.DOTALL)
if m:
    print("\n--- set-stealth-state handler ---")
    print(m.group(0))
