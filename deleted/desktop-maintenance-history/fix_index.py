import re

file_path = r"c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\index.js"
with open(file_path, 'r', encoding='utf-8') as f:
    code = f.read()

# Replace start-session-window to just notify mainWindow
start_target = """    ipcMain.handle('start-session-window', async (event, options) => {
        try {
            if (options && options.selectedProfile) {
                lastSessionOptions = options;
            }

            if (!sessionWindow || sessionWindow.isDestroyed()) {
                sessionWindow = createSessionWindow(sendToRenderer, geminiSessionRef, options);
                if (sessionState !== 'paused') {
                    sessionStartTime = Date.now();
                }
                sessionState = 'active';
                try { require('./utils/window').triggerAutoStealthStart(); } catch(e) { console.error(e); }
                
                sessionWindow.on('closed', () => {
                    if (sessionState === 'active') {
                        sessionState = 'paused';
                        if (mainWindow && !mainWindow.isDestroyed()) {
                            mainWindow.webContents.send('session-status-changed', { state: sessionState, startTime: sessionStartTime });
                        }
                    }
                });
            } else {
                sessionWindow.webContents.send('update-session-state', options);
                sessionWindow.show();
                sessionWindow.focus();
                sessionState = 'active';
            }
            if (mainWindow && !mainWindow.isDestroyed()) {
                mainWindow.webContents.send('session-status-changed', { state: sessionState, startTime: sessionStartTime });
            }
            return { success: true };
        } catch (error) {
            console.error('Error starting session:', error);
            return { success: false, error: error.message };
        }
    });"""

start_replacement = """    ipcMain.handle('start-session-window', async (event, options) => {
        try {
            if (options && options.selectedProfile) {
                lastSessionOptions = options;
            }
            
            if (sessionState !== 'paused') {
                sessionStartTime = Date.now();
            }
            sessionState = 'active';
            try { require('./utils/window').triggerAutoStealthStart(); } catch(e) { console.error(e); }

            if (mainWindow && !mainWindow.isDestroyed()) {
                mainWindow.webContents.send('session-status-changed', { state: sessionState, startTime: sessionStartTime });
                mainWindow.webContents.send('update-session-state', options);
            }
            return { success: true };
        } catch (error) {
            console.error('Error starting session:', error);
            return { success: false, error: error.message };
        }
    });"""
code = code.replace(start_target, start_replacement)

# Replace close/pause
code = re.sub(r'if \(sessionWindow && !sessionWindow\.isDestroyed\(\)\) \{\s*sessionWindow\.destroy\(\);\s*sessionWindow = null;\s*\}', '', code)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(code)

print("SUCCESS")
