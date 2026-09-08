const { app, BrowserWindow, shell, ipcMain, dialog, Menu } = require('electron');
const path = require('path');

if (process.argv.includes('--squirrel-uninstall')) {
    app.whenReady().then(() => {
        const response = dialog.showMessageBoxSync({
            type: 'warning',
            buttons: ['Yes, Uninstall', 'Cancel'],
            defaultId: 1,
            cancelId: 1,
            title: 'Uninstall HideWin',
            message: 'Are you sure you want to completely remove HideWin?',
        });
        if (response === 0) {
            require('electron-squirrel-startup');
            process.exit(0);
        } else {
            process.exit(1);
        }
    });
    return; // Wait for app ready and user response
}

if (require('electron-squirrel-startup')) {
    process.exit(0);
}

// Bypass Pointer Lock user gesture requirement so Ctrl+Alt+M global shortcut can trigger it immediately
app.commandLine.appendSwitch('disable-features', 'PointerLockRequiresUserGesture');
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');

const { createWindow, createSessionWindow, updateGlobalShortcuts } = require('./utils/window');
const { setupGeminiIpcHandlers, stopMacOSAudioCapture, sendToRenderer } = require('./utils/gemini');
const storage = require('./storage');
const { setupStorageIpcHandlers, setupGeneralIpcHandlers } = require('./ipc-handlers');

const geminiSessionRef = { current: null };
let mainWindow = null;
let sessionWindow = null;
let sessionStartTime = null;
let sessionState = 'idle'; // 'idle', 'active', 'paused'

// Restore the OS cursor immediately — in case a previous session crashed while
// stealth mode was active and left the cursor permanently invisible.
function restoreOsCursor() {
    if (process.platform !== 'win32') return;
    const path = require('path');
    const exePath = path.join(__dirname, 'utils', 'RestoreCursor.exe');
    require('child_process').execFile(exePath, (err) => {
        if (err) console.warn('Cursor restore error (startup):', err.message);
    });
}

function createMainWindow() {
    mainWindow = createWindow(sendToRenderer, geminiSessionRef);
    
    mainWindow.on('close', (event) => {
        if (!app.isQuiting) {
            event.preventDefault();
            mainWindow.hide();
            mainWindow.setSkipTaskbar(true);
            return;
        }

        if (sessionWindow && !sessionWindow.isDestroyed()) {
            const { dialog } = require('electron');
            const choice = dialog.showMessageBoxSync(mainWindow, {
                type: 'question',
                buttons: ['Yes', 'Cancel'],
                title: 'Confirm Close',
                message: 'A session is currently running. Are you sure you want to close the app and end the session?'
            });
            if (choice === 1) {
                event.preventDefault();
            }
        }
    });

    return mainWindow;
}

const PROTOCOL_NAME = 'hidewin';

if (process.defaultApp) {
    if (process.argv.length >= 2) {
        app.setAsDefaultProtocolClient(PROTOCOL_NAME, process.execPath, [path.resolve(process.argv[1])]);
    }
} else {
    app.setAsDefaultProtocolClient(PROTOCOL_NAME);
}

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
    app.quit();
} else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        // Someone tried to run a second instance, we should focus our window.
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.focus();
        }
        
        // Find the deep link URL in the command line args
        const url = commandLine.find(arg => arg.startsWith(`${PROTOCOL_NAME}://`));
        if (url) {
            handleDeepLink(url);
        }
    });
}

app.on('open-url', (event, url) => {
    event.preventDefault();
    handleDeepLink(url);
});

function handleDeepLink(urlStr) {
    try {
        const url = new URL(urlStr);
        if (url.hostname === 'auth') {
            const token = url.searchParams.get('token');
            const hash = url.searchParams.get('hash');
            const userEncoded = url.searchParams.get('user');
            
            if (token && hash) {
                // Send to renderer
                if (mainWindow) {
                    mainWindow.webContents.send('deep-link-auth-success', {
                        token,
                        hash,
                        user: userEncoded ? JSON.parse(decodeURIComponent(userEncoded)) : null
                    });
                }
            }
        }
    } catch (e) {
        console.error('Error parsing deep link:', e);
    }
}

app.whenReady().then(async () => {
    // Initialize storage (checks version, resets if needed)
    storage.initializeStorage();

    // Trigger screen recording permission prompt on macOS if not already granted
    if (process.platform === 'darwin') {
        const { desktopCapturer } = require('electron');
        desktopCapturer.getSources({ types: ['screen'] }).catch(() => {});
    }

    // Pre-boot the background engine so Windows loading spinners happen now instead of mid-session
    try {
        const winUtils = require('./utils/window');
        if (winUtils.triggerAutoStealthStartFn) winUtils.triggerAutoStealthStartFn();
    } catch(e) {}
    
    // Restore OS cursor on startup in case previous session left it hidden
    restoreOsCursor();

    const win = createMainWindow();
    
    // Process deep link if launched via Windows protocol handler from cold start
    const startupUrl = process.argv.find(arg => arg.startsWith(`${PROTOCOL_NAME}://`));
    if (startupUrl) {
        win.webContents.once('did-finish-load', () => {
            setTimeout(() => {
                handleDeepLink(startupUrl);
            }, 500);
        });
    }

    setupGeminiIpcHandlers(geminiSessionRef);
    setupStorageIpcHandlers();
    setupGeneralIpcHandlers();
});

app.on('web-contents-created', (event, contents) => {
    contents.on('context-menu', (e, params) => {
        const { Menu, MenuItem } = require('electron');
        const menu = new Menu();

        if (params.isEditable) {
            menu.append(new MenuItem({ label: 'Undo', role: 'undo' }));
            menu.append(new MenuItem({ label: 'Redo', role: 'redo' }));
            menu.append(new MenuItem({ type: 'separator' }));
            menu.append(new MenuItem({ label: 'Cut', role: 'cut' }));
        }

        if (params.isEditable || params.selectionText) {
            menu.append(new MenuItem({ label: 'Copy', role: 'copy' }));
        }

        if (params.isEditable) {
            menu.append(new MenuItem({ label: 'Paste', role: 'paste' }));
            menu.append(new MenuItem({ label: 'Select All', role: 'selectAll' }));
        }

        if (menu.items.length > 0) {
            menu.popup({ window: BrowserWindow.fromWebContents(contents) });
        }
    });
});

app.on('window-all-closed', () => {
    stopMacOSAudioCapture();
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('before-quit', () => {
    stopMacOSAudioCapture();
    // Always restore the OS cursor when the app exits
    restoreOsCursor();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow();
    }
});

// setupStorageIpcHandlers -> ipc-handlers.js


// setupGeneralIpcHandlers -> ipc-handlers.js
