with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\MouseBlocker.cs', 'r', encoding='utf-8') as f:
    content = f.read()

target = 'if (line.StartsWith("LOCK")) _isLocked = true;'
rep = 'if (line.StartsWith("LOCK")) { netDX = 0; netDY = 0; _isLocked = true; }'
content = content.replace(target, rep)

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\MouseBlocker.cs', 'w', encoding='utf-8') as f:
    f.write(content)

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\window.js', 'r', encoding='utf-8') as f:
    win_content = f.read()

target_win = """                } else if (line.startsWith('MOVE')) {
                    const parts = line.split(' ');
                    if (parts.length === 3) {
                        redDotDX += parseInt(parts[1], 10);
                        redDotDY += parseInt(parts[2], 10);"""

rep_win = """                } else if (line.startsWith('MOVE:')) {
                    const parts = line.substring(5).split(',');
                    if (parts.length === 2) {
                        redDotDX = parseInt(parts[0], 10);
                        redDotDY = parseInt(parts[1], 10);"""
win_content = win_content.replace(target_win, rep_win)

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\window.js', 'w', encoding='utf-8') as f:
    f.write(win_content)

print("Fixed MOVE parsing and reset logic")
