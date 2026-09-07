import sys, re

with open("src/components/views/AssistantView.js", "r", encoding="utf-8") as f:
    code = f.read()

# Fix history-question text color
code = re.sub(r'(\.history-question\s*\{[^}]*color:\s*)var\(--bg-hover\)', r'\1var(--text-primary)', code)

# Fix custom-dropdown-menu background
code = code.replace("background: rgba(30, 30, 35, 0.95);", "background: var(--bg-app);")

# Fix mode-selector and profile-selector text spans which might still have var(--bg-elevated)
# Wait, I already fixed some of these but maybe missed the ones that were var(--bg-hover)?
code = re.sub(r'color:\s*var\(--bg-hover\);', 'color: var(--text-primary);', code)

with open("src/components/views/AssistantView.js", "w", encoding="utf-8") as f:
    f.write(code)

print("Fixed history-question and remaining dropdown colors in AssistantView.js")
