with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\window.js', 'r', encoding='utf-8') as f:
    content = f.read()

target1 = """                    if (!clickedApp) {
                        const robot = require('robotjs');
                        // Teleport OS cursor to Red Arrow to click background IDE, then instantly snap back
                        robot.moveMouse(dotX, dotY);
                        robot.mouseToggle(isDown ? 'down' : 'up', button);
                        robot.moveMouse(frozenScreenX, frozenScreenY);
                    }"""

rep1 = """                    if (!clickedApp) {
                        if (blockerProcess && blockerProcess.stdin) {
                            blockerProcess.stdin.write(`CLICK:${dotX},${dotY},${isDown ? 'down' : 'up'},${button},${frozenScreenX},${frozenScreenY}\\n`);
                        }
                    }"""

target2 = """                    const robot = require('robotjs');
                    const notches = Math.round(delta / 120);
                    if (notches !== 0) {
                        const dotX = frozenScreenX + redDotDX;
                        const dotY = frozenScreenY + redDotDY;
                        robot.moveMouse(dotX, dotY);
                        robot.scrollMouse(0, notches); 
                        robot.moveMouse(frozenScreenX, frozenScreenY);
                    }"""

rep2 = """                    const notches = Math.round(delta / 120);
                    if (notches !== 0) {
                        const dotX = frozenScreenX + redDotDX;
                        const dotY = frozenScreenY + redDotDY;
                        if (blockerProcess && blockerProcess.stdin) {
                            blockerProcess.stdin.write(`SCROLL:${notches},${dotX},${dotY},${frozenScreenX},${frozenScreenY}\\n`);
                        }
                    }"""

content = content.replace(target1, rep1).replace(target2, rep2)
with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\window.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Removed robotjs from window.js")
