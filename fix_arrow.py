import re
with open('Hide-Win-Master/src/components/app/HideWinApp.js', 'r', encoding='utf-8') as f:
    text = f.read()

# The corrupted arrow string looks like `+'` but we can just regex replace everything inside the span
new_span = '<span aria-hidden="true">?</span>'

text = re.sub(r'<span aria-hidden="true">.*?</span>', new_span, text)

with open('Hide-Win-Master/src/components/app/HideWinApp.js', 'w', encoding='utf-8') as f:
    f.write(text)
