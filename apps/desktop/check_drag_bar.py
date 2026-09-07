with open("src/components/app/HideWinApp.js", "r", encoding="utf-8") as f:
    lines = f.readlines()
start_idx = 0
for i, line in enumerate(lines):
    if '<div class="top-drag-bar"' in line:
        start_idx = i
        break
for i in range(start_idx, start_idx+30):
    print(f"{i}: {lines[i].strip()}")
