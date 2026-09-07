with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\index.js', 'r', encoding='utf-8') as f:
    content = f.read()

target = """exec(`powershell -Command "${psCommand}"`, (error) => {"""
replacement = """exec(`powershell -NoProfile -NonInteractive -WindowStyle Hidden -Command "${psCommand}"`, (error) => {"""

content = content.replace(target, replacement)

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\index.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Added -NoProfile -NonInteractive to PowerShell exec")
