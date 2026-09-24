file_path = r"c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\index.js"
with open(file_path, 'r', encoding='utf-8') as f:
    code = f.read()

import re

# 1. Replace the entire start-session block
code = re.sub(
    r"ipcMain\.handle\('start-session',\s*async\s*\(event,\s*options\s*=\s*\{\}\)\s*=>\s*\{.*?(?=ipcMain\.handle\('get-session-status')",
    """ipcMain.handle('start-session', async (event, options = {}) => {
        try {
            if (sessionState === 'paused') {
                options = { ...lastSessionOptions, ...(options.modeCategory ? options : {}) };
            } else {
                lastSessionOptions = options;
            }

            if (sessionState !== 'paused') {
                sessionStartTime = Date.now();
            }
            sessionState = 'active';
            try { require('./utils/window').triggerAutoStealthStart(); } catch(e) { console.error(e); }
            
            // Do NOT create a new window. Instead, tell mainWindow to transition into session UI.
            if (mainWindow && !mainWindow.isDestroyed()) {
                mainWindow.webContents.send('update-session-state', options);
                mainWindow.webContents.send('session-status-changed', { state: sessionState, startTime: sessionStartTime });
            }
            return { success: true };
        } catch (error) {
            console.error('Error starting session:', error);
            return { success: false, error: error.message };
        }
    });

    """,
    code,
    flags=re.DOTALL
)

# 2. Replace pause-session-window
code = re.sub(
    r"ipcMain\.handle\('pause-session-window',\s*async\s*\(event\)\s*=>\s*\{.*?(?=ipcMain\.handle\('close-session-window')",
    """ipcMain.handle('pause-session-window', async (event) => {
        try {
            if (sessionState === 'active') sessionState = 'paused';
            try { require('./utils/window').triggerAutoStealthStop(); } catch(e) { console.error(e); }
            
            if (mainWindow && !mainWindow.isDestroyed()) {
                mainWindow.webContents.send('session-status-changed', { state: sessionState, startTime: sessionStartTime });
            }
            return { success: true };
        } catch (error) {
            console.error('Error pausing session window:', error);
            return { success: false, error: error.message };
        }
    });

    """,
    code,
    flags=re.DOTALL
)

# 3. Replace close-session-window
code = re.sub(
    r"ipcMain\.handle\('close-session-window',\s*async\s*\(event\)\s*=>\s*\{.*?(?=ipcMain\.handle\('end-session-completely')",
    """ipcMain.handle('close-session-window', async (event) => {
        try {
            sessionState = 'idle';
            try { require('./utils/window').triggerAutoStealthStop(); } catch(e) { console.error(e); }
            sessionStartTime = null;
            
            if (mainWindow && !mainWindow.isDestroyed()) {
                mainWindow.webContents.send('session-status-changed', { state: sessionState, startTime: null });
            }
            return { success: true };
        } catch (error) {
            console.error('Error closing session:', error);
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
