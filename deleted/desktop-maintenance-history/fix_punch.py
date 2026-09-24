import re

fpath = 'src/components/app/HideWinAppEvents.js'
with open(fpath, 'r', encoding='utf-8') as f:
    content = f.read()

# Add .mouse-toggle-wrapper to the query selectors
content = content.replace(
    ".querySelectorAll('.mouse-toggle-container')",
    ".querySelectorAll('.mouse-toggle-container, .mouse-toggle-wrapper')"
)

with open(fpath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated HideWinAppEvents.js to include .mouse-toggle-wrapper.")
