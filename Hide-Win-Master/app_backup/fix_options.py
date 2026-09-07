import re

path = 'src/components/views/AICustomizeView.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add option styling after .form-control { ... }
target = r"(\.form-control \{[^}]+\})"
replacement = r"\1\n\n            option {\n                background-color: var(--bg-surface) !important;\n                color: var(--text-primary) !important;\n            }"
content = re.sub(target, replacement, content, count=1)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Added explicit option styling!")
