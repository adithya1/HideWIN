import re

filepath = r"Hide-Win-Master\src\index.js"
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "app.commandLine.appendSwitch('disable-features', 'PointerLockRequiresUserGesture');",
    "app.commandLine.appendSwitch('disable-features', 'PointerLockRequiresUserGesture');\napp.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');"
)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
