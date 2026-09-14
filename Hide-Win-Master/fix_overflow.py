import re

fpath = 'src/components/app/HideWinApp.styles.js'
with open(fpath, 'r', encoding='utf-8') as f:
    content = f.read()

# Remove overflow: hidden from universal selector
content = re.sub(r'(\*\s*\{[^}]*?)overflow:\s*hidden;([^}]*\})', r'\1\2', content)

with open(fpath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Removed dangerous overflow: hidden from *")
