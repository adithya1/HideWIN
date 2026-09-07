with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\index.js', 'r', encoding='utf-8') as f:
    content = f.read()

target = """            const success = shell.writeShortcutLink(shortcutPath, {
                target: process.execPath,
                args: `${PROTOCOL_NAME}://note?id=${noteId}`,
                description: `Open HideWin Note: ${safeTitle}`
            });
            
            return { success };"""

replacement = """            // Electron's shell.writeShortcutLink sometimes fails silently with OneDrive desktops.
            // Use PowerShell fallback for guaranteed shortcut creation.
            const { exec } = require('child_process');
            const targetPath = process.execPath;
            const args = `${PROTOCOL_NAME}://note?id=${noteId}`;
            const psCommand = `$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('${shortcutPath}'); $Shortcut.TargetPath = '${targetPath}'; $Shortcut.Arguments = '${args}'; $Shortcut.Save()`;
            
            return new Promise((resolve) => {
                exec(`powershell -Command "${psCommand}"`, (error) => {
                    if (error) {
                        console.error('PS Shortcut failed:', error);
                        resolve({ success: false, error: error.message });
                    } else {
                        resolve({ success: true });
                    }
                });
            });"""

content = content.replace(target, replacement)

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\index.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Patched index.js to use PowerShell for desktop shortcuts")
