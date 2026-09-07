import re

filepath = r"c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

target = r"this\.currentView = config\.onboarded \? 'main' : 'onboarding';"
replacement = r"this.currentView = 'main'; // Bypassed onboarding"

content = re.sub(target, replacement, content)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
print("Bypassed onboarding in HideWinApp.js")
