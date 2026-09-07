with open("src/components/app/HideWinApp.js", "r", encoding="utf-8") as f:
    lines = f.readlines()
for i, line in enumerate(lines):
    if 'mobile-hamburger' in line and 'class' in line:
        print(f"Found at {i}: {line.strip()}")
