import re

fpath = 'src/components/views/MainView.js'
with open(fpath, 'r', encoding='utf-8') as f:
    content = f.read()

# Remove inline styles from pinned-shortcuts-container
content = re.sub(
    r'<div class="pinned-shortcuts-container"[^>]*?style="[^"]*"',
    '<div class="pinned-shortcuts-container"',
    content
)

# And remove inline styles from the "Pinned Shortcuts" subtext to align it cleanly
content = re.sub(
    r'<div class="home-subtext"[^>]*?style="[^"]*"',
    '<div class="home-subtext" style="font-size: 14px; font-weight: 600; color: var(--text-primary); text-align: center; margin-top: clamp(8px, 2vh, 24px); margin-bottom: 0;"',
    content
)

with open(fpath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Cleaned up pinned shortcuts HTML.")
