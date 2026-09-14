import re

fpath = 'src/components/views/MainView.js'
with open(fpath, 'r', encoding='utf-8') as f:
    content = f.read()

# Completely remove the action-divider div from the HTML
content = re.sub(
    r'<div class="action-divider"[^>]*></div>',
    '',
    content
)

with open(fpath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Removed action-divider HTML.")
