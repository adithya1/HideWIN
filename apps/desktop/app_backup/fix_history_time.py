import sys, re

with open("src/components/views/AssistantView.js", "r", encoding="utf-8") as f:
    code = f.read()

code = code.replace("color: var(--border);", "color: var(--text-secondary);")

with open("src/components/views/AssistantView.js", "w", encoding="utf-8") as f:
    f.write(code)

print("Fixed history-time color in AssistantView.js")
