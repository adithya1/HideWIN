with open("src/components/app/HideWinApp.js", "r", encoding="utf-8") as f:
    lines = f.readlines()
start = next(i for i, line in enumerate(lines) if '<div class="app-shell app-shell-main"' in line)
for i in range(start, start+40):
    print(f"{i}: {lines[i].rstrip()}")
