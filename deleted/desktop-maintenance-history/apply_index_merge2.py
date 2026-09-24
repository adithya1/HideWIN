file_path = r"c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\index.js"
with open(file_path, 'r', encoding='utf-8') as f:
    code = f.read()

import re
code = re.sub(
    r"ipcMain\.handle\('end-session-completely',\s*async\s*\(event\)\s*=>\s*\{.*?(?=ipcMain\.on\('save-keybinds')",
    """ipcMain.handle('end-session-completely', async (event) => {
        try {
            sessionState = 'idle';
            try { require('./utils/window').triggerAutoStealthStop(); } catch(e) { console.error(e); }
            sessionStartTime = null;
            if (mainWindow && !mainWindow.isDestroyed()) {
                mainWindow.webContents.send('session-status-changed', { state: sessionState, startTime: null });
            }
            return { success: true };
        } catch (error) {
            console.error('Error ending session:', error);
            return { success: false, error: error.message };
        }
    });

    """,
    code,
    flags=re.DOTALL
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(code)

print("SUCCESS")
