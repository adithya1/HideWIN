const { app, BrowserWindow, shell, ipcMain, dialog, Menu } = require('electron');
app.disableHardwareAcceleration();
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
const { setupStorageIpcHandlers } = require('./ipc-handlers');

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

const configManager = require('./utils/configManager');
const PROTOCOL_NAME = configManager.getProtocolName();

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
        if (url.hostname === 'auth' || url.hostname === 'callback') {
            const token = url.searchParams.get('token') || url.searchParams.get('code');
            const hash = url.searchParams.get('hash') || 'default-hash';
            const userEncoded = url.searchParams.get('user');
            
            if (token) {
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


function setupGeneralIpcHandlers() {
    ipcMain.handle('get-app-version', async () => {
        return app.getVersion();
    });

    ipcMain.handle('set-native-theme', async (event, theme) => {
        const { nativeTheme } = require('electron');
        nativeTheme.themeSource = theme;
        return true;
    });

    ipcMain.handle('quit-application', async event => {
        try {
            stopMacOSAudioCapture();
            app.quit();
            return { success: true };
        } catch (error) {
            console.error('Error quitting application:', error);
            return { success: false, error: error.message };
        }
    });

        ipcMain.on('social-share', async (event, { platform, text }) => {
        try {
            const encodedText = encodeURIComponent(text);
            let url = '';
            if (platform === 'whatsapp') url = `https://wa.me/?text=${encodedText}`;
            else if (platform === 'gmail') url = `https://mail.google.com/mail/?view=cm&fs=1&body=${encodedText}`;
            else if (platform === 'outlook') url = `https://outlook.live.com/mail/0/deeplink/compose?body=${encodedText}`;
            
            if (url) {
                const { shell } = require('electron');
                await shell.openExternal(url);
            }
        } catch (err) {
            console.error('Failed to handle social share:', err);
        }
    });

    ipcMain.handle('open-external', async (event, url) => {
        try {
            await shell.openExternal(url);
            return { success: true };
        } catch (error) {
            console.error('Error opening external URL:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('open-path', async (event, filePath) => {
        try {
            await shell.openPath(filePath);
            return { success: true };
        } catch (error) {
            console.error('Error opening file path:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('check-session-status', () => {
    return {
        active: typeof sessionWindow !== 'undefined' && sessionWindow && !sessionWindow.isDestroyed()
    };
});

ipcMain.handle('show-confirm-dialog', async (event, message) => {
        const { dialog } = require('electron');
        const win = BrowserWindow.fromWebContents(event.sender);
        const { response } = await dialog.showMessageBox(win, {
            type: 'question',
            buttons: ['Cancel', 'OK'],
            defaultId: 1,
            title: 'Confirm',
            message: message,
        });
        return response === 1;
    });

    let lastSessionOptions = {};

    ipcMain.handle('start-session', async (event, options = {}) => {
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

    ipcMain.handle('get-session-status', async () => {
        const active = !!(sessionWindow && !sessionWindow.isDestroyed());
        if (!active && sessionState === 'active') sessionState = 'paused'; // Fallback
        if (sessionState === 'idle') sessionStartTime = null;
        return { 
            state: sessionState,
            startTime: sessionStartTime
        };
    });

    ipcMain.handle('pause-session-window', async (event) => {
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

    ipcMain.handle('close-session-window', async (event) => {
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

    ipcMain.handle('end-session-completely', async (event) => {
        try {
            sessionState = 'idle';
            try { require('./utils/window').triggerAutoStealthStop(); } catch(e) { console.error(e); }
            sessionStartTime = null;
            if (sessionWindow && !sessionWindow.isDestroyed()) {
                sessionWindow.destroy();
                sessionWindow = null;
            }
            if (mainWindow && !mainWindow.isDestroyed()) {
                mainWindow.webContents.send('session-status-changed', { state: sessionState, startTime: null });
            }
            return { success: true };
        } catch (error) {
            console.error('Error ending session:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.on('update-keybinds', (event, newKeybinds) => {
        if (mainWindow) {
            // Also save to storage
            storage.setKeybinds(newKeybinds);
            updateGlobalShortcuts(newKeybinds, mainWindow, sendToRenderer, geminiSessionRef);
        }
    });

    // Profiles IPC
    ipcMain.handle('get-profiles', async () => {
        return storage.getProfiles();
    });

    ipcMain.handle('save-profiles', async (event, profiles) => {
        return storage.saveProfiles(profiles);
    });

    // Debug logging from renderer
    ipcMain.on('log-message', (event, msg) => {
        console.log(msg);
    });

    // Open Mac Settings
    ipcMain.on('open-mac-settings', () => {
        require('child_process').exec('open "x-apple.systempreferences:com.apple.preference.security?Privacy_Accessibility"');
    });

    // Open Admin Dashboard
    ipcMain.on('open-admin-dashboard', () => {
        const adminWindow = new BrowserWindow({
            width: 1200,
            height: 800,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false
            }
        });
        adminWindow.loadFile(path.join(__dirname, 'admin.html'));
        adminWindow.maximize();
    });

    // Document Parsing
    ipcMain.handle('parse-document', async (event, filePath) => {
        try {
            const fs = require('fs');
            const path = require('path');
            if (!fs.existsSync(filePath)) throw new Error('File not found');

            // Read the first 4 bytes to check magic numbers securely
            const fd = fs.openSync(filePath, 'r');
            const buffer = Buffer.alloc(4);
            fs.readSync(fd, buffer, 0, 4, 0);
            fs.closeSync(fd);
            const hex = buffer.toString('hex').toUpperCase();

            const ext = path.extname(filePath).toLowerCase();
            
            // Check magic number or fallback to extension
            if (hex.startsWith('25504446') || ext === '.pdf') {
                const pdf = require('pdf-parse');
                const dataBuffer = fs.readFileSync(filePath);
                const data = await pdf(dataBuffer);
                return { success: true, text: data.text };
            } else if (hex.startsWith('504B0304') || hex.startsWith('504B0506') || hex.startsWith('504B0708') || ext === '.docx') {
                const mammoth = require('mammoth');
                const result = await mammoth.extractRawText({ path: filePath });
                return { success: true, text: result.value };
            } else if (hex.startsWith('D0CF11E0') || ext === '.doc') {
                try {
                    const WordExtractor = require('word-extractor');
                    const extractor = new WordExtractor();
                    const extracted = await extractor.extract(filePath);
                    return { success: true, text: extracted.getBody() };
                } catch (e) {
                    console.error('WordExtractor error:', e);
                    throw new Error('Failed to parse .doc file. Please save it as .docx or .pdf.');
                }
            } else {
                // If it's not a known binary type, try reading as text
                const text = fs.readFileSync(filePath, 'utf8');
                
                // Safety check: don't return raw RTF or binary garbage
                if (text.startsWith('{\\rtf')) {
                    throw new Error('RTF files are not supported. Please save your document as a .pdf, .docx, or plain .txt file.');
                }
                // Check for null bytes (binary file)
                if (text.indexOf('\0') !== -1) {
                    throw new Error('Unsupported binary file format. Please upload a .pdf, .docx, or .txt file.');
                }
                // Check for PK signature (zip/docx) just in case the first bytes were offset
                if (text.startsWith('PK\x03\x04')) {
                    throw new Error('File appears to be a DOCX/ZIP but could not be parsed. Please re-save the file and try again.');
                }
                
                return { success: true, text };
            }
        } catch (error) {
            console.error('Error parsing document:', error);
            return { success: false, error: error.message };
        }
    });
}






