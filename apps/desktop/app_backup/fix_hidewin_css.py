import sys, re

with open("src/components/app/HideWinApp.js", "r", encoding="utf-8") as f:
    code = f.read()

# Fix status colors for light/dark mode support
code = code.replace("color: #4ade80;", "color: var(--success, #22c55e);")
code = code.replace("background: rgba(34, 197, 94, 0.15);", "background: rgba(34, 197, 94, 0.1);")
code = code.replace("color: #fbbf24;", "color: var(--warning, #d97706);")

# Also fix the top bar borders that are white
code = code.replace("border-bottom: 3px solid rgba(255, 255, 255, 0.1);", "border-bottom: 3px solid var(--border);")
code = code.replace("border-top: 3px solid rgba(255, 255, 255, 0.1);", "border-top: 3px solid var(--border);")
code = code.replace("border-left: 3px solid rgba(255, 255, 255, 0.1);", "border-left: 3px solid var(--border);")
code = code.replace("border-right: 3px solid rgba(255, 255, 255, 0.1);", "border-right: 3px solid var(--border);")

with open("src/components/app/HideWinApp.js", "w", encoding="utf-8") as f:
    f.write(code)

print("Fixed status colors and borders in HideWinApp.js")
