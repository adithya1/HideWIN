import re

path = 'src/index.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

handler_code = """
    ipcMain.handle('set-native-theme', async (event, theme) => {
        const { nativeTheme } = require('electron');
        nativeTheme.themeSource = theme;
    });
"""

# Insert inside setupGeneralIpcHandlers()
target = r"function setupGeneralIpcHandlers\(\)\s*\{"
replacement = f"function setupGeneralIpcHandlers() {{\n{handler_code}"

content = re.sub(target, replacement, content, count=1)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Injected set-native-theme handler into src/index.js!")
