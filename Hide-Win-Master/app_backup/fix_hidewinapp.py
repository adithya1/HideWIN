import sys, re

with open("src/components/app/HideWinApp.js", "r", encoding="utf-8") as f:
    code = f.read()

# Fix colors
code = re.sub(r'color:\s*var\(--bg-elevated\);?', 'color: var(--text-primary);', code)
code = re.sub(r'color:\s*var\(--bg-elevated\)', 'color: var(--text-primary)', code)
code = code.replace("rgba(30,32,38,0.95)", "var(--bg-app)")
code = code.replace("rgba(20,22,28,0.95)", "var(--bg-app)")

with open("src/components/app/HideWinApp.js", "w", encoding="utf-8") as f:
    f.write(code)

print("Replaced colors in HideWinApp.js")
