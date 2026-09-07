import re

# 1. Update index.js (main process) to handle native theme
path_index = 'index.js'
with open(path_index, 'a', encoding='utf-8') as f:
    f.write("\n\n// Added for native theme support\n")
    f.write("try {\n")
    f.write("    const electron_mod = require('electron');\n")
    f.write("    electron_mod.ipcMain.handle('set-native-theme', (event, theme) => {\n")
    f.write("        electron_mod.nativeTheme.themeSource = theme;\n")
    f.write("    });\n")
    f.write("} catch(e) { console.error('Failed to bind set-native-theme', e); }\n")

# 2. Update renderer.js to actually call color-scheme and ipcMain
path_renderer = 'src/utils/renderer.js'
with open(path_renderer, 'r', encoding='utf-8') as f:
    ren_content = f.read()

# We need to replace the block we added last time and add the ipc call, and also make sure colorScheme is set natively
# We used: root.style.setProperty('--color-scheme', isLight ? 'light' : 'dark');
# Let's replace it with root.style.colorScheme = isLight ? 'light' : 'dark';

def replacer(match):
    return """
        // Apply color-scheme dynamically for native elements (like select, scrollbars)
        root.style.colorScheme = isLight ? 'light' : 'dark';
        
        // Also tell the main process to update native OS dialogs (like file browser)
        if (window.hideWin && window.hideWin.ipcRenderer) {
            window.hideWin.ipcRenderer.invoke('set-native-theme', isLight ? 'light' : 'dark').catch(e => console.error('Failed to set native theme', e));
        }
        
        // Dynamically adjust scrollbar thumbs
        if (isLight) {
            root.style.setProperty('--scrollbar-thumb', 'rgba(0, 0, 0, 0.2)');
            root.style.setProperty('--scrollbar-thumb-hover', 'rgba(0, 0, 0, 0.4)');
        } else {
            root.style.setProperty('--scrollbar-thumb', 'rgba(255, 255, 255, 0.15)');
            root.style.setProperty('--scrollbar-thumb-hover', 'rgba(255, 255, 255, 0.3)');
        }
"""

ren_content = re.sub(r'// Apply color-scheme dynamically for native elements.*?\}\s*\}', replacer, ren_content, flags=re.DOTALL)

with open(path_renderer, 'w', encoding='utf-8') as f:
    f.write(ren_content)

print("Updated native theme handling in index.js and renderer.js!")
