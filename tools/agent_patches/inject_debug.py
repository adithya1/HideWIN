import re

path = r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\window.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

debug_inject = """
    const debugLog = (msg) => {
        require('fs').appendFileSync('C:\\\\Users\\\\akula\\\\Downloads\\\\Hide-WIN\\\\stealth_debug.log', new Date().toISOString() + ': ' + msg + '\\n');
    };
"""

content = content.replace("let mainWindowId = null;", debug_inject + "let mainWindowId = null;")

# Add logs to startStealthMode
content = content.replace("isMomentaryStealth = momentary;", "debugLog('startStealthMode called, momentary: ' + momentary);\n    isMomentaryStealth = momentary;")
content = content.replace("stealthCursorWindow = new BrowserWindow", "debugLog('Creating stealthCursorWindow...');\n    stealthCursorWindow = new BrowserWindow")
content = content.replace("stealthCursorWindow.loadURL", "debugLog('Loading HTML into stealthCursorWindow...');\n    stealthCursorWindow.loadURL")

# Add logs to shortcuts
content = content.replace("globalShortcut.register(keybinds.momentaryStealth, () => {", "globalShortcut.register(keybinds.momentaryStealth, () => {\n                debugLog('Alt+A pressed!');")
content = content.replace("globalShortcut.register(keybinds.toggleMouseVisibility, () => {", "globalShortcut.register(keybinds.toggleMouseVisibility, () => {\n                debugLog('Alt+M pressed!');")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Injected debug logging!")
