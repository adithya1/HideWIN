import re

path = 'src/components/app/HideWinApp.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the help item from the menu array
content = re.sub(
    r"\s*\{\s*id:\s*'help',\s*label:\s*'Help',\s*icon:\s*html`<svg[^>]*>.*?</svg>`\s*\}",
    "",
    content,
    flags=re.DOTALL
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Removed Help from menu bar")
