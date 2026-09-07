with open("src/components/views/MainView.js", "r", encoding="utf-8") as f:
    lines = f.readlines()
start = next(i for i, line in enumerate(lines) if '<div class="action-bar-pill"' in line)
for i in range(start, start+45):
    print(f"{i}: {lines[i].rstrip()}")
