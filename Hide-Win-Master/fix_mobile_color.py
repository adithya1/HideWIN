import re

with open('src/components/views/MainView.js', 'r', encoding='utf-8') as f:
    code = f.read()

code = code.replace("background: var(--accent, #3b82f6) !important;", "background: #3b82f6 !important;")

with open('src/components/views/MainView.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("Updated color.")
