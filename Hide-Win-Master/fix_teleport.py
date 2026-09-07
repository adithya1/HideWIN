with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\window.js', 'r', encoding='utf-8') as f:
    content = f.read()

target = """                    if (!clickedApp) {
                        const robot = require('robotjs');
                        robot.mouseToggle(isDown ? 'down' : 'up', button);
                    }"""

rep = """                    if (!clickedApp) {
                        const robot = require('robotjs');
                        // Teleport OS cursor to Red Arrow to click background IDE, then instantly snap back
                        robot.moveMouse(dotX, dotY);
                        robot.mouseToggle(isDown ? 'down' : 'up', button);
                        robot.moveMouse(frozenScreenX, frozenScreenY);
                    }"""
if target in content:
    content = content.replace(target, rep)
    with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\window.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Fixed robot click teleport")
else:
    print("Target 1 not found")

target2 = """                    const robot = require('robotjs');
                    const notches = Math.round(delta / 120);
                    if (notches !== 0) {
                        robot.scrollMouse(0, notches); 
                    }"""

rep2 = """                    const robot = require('robotjs');
                    const notches = Math.round(delta / 120);
                    if (notches !== 0) {
                        const dotX = frozenScreenX + redDotDX;
                        const dotY = frozenScreenY + redDotDY;
                        robot.moveMouse(dotX, dotY);
                        robot.scrollMouse(0, notches); 
                        robot.moveMouse(frozenScreenX, frozenScreenY);
                    }"""
if target2 in content:
    content = content.replace(target2, rep2)
    with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\window.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Fixed robot scroll teleport")
else:
    print("Target 2 not found")
