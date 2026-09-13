const { BrowserWindow, globalShortcut, ipcMain, screen } = require('electron');
const path = require('node:path');
const os = require('os');
const fs = require('fs');
const storage = require('../storage');

let mouseEventsIgnored = false;
let stealthOverlay = null;

let stealthActive = false;
let stealthPaused = false;
let blockerProcess = null;
let frozenScreenX = 0;
let frozenScreenY = 0;
let redDotDX = 0;
let redDotDY = 0;
let blockerExePath = null;
let stealthCursorWindow = null;
let keyupWindow = null;

function initHiddenWindows() {
    const { BrowserWindow, screen } = require('electron');
    if (!stealthCursorWindow || stealthCursorWindow.isDestroyed()) {
        const displays = screen.getAllDisplays();
        let minX = 0, minY = 0, maxX = 0, maxY = 0;
        displays.forEach(d => {
            if (d.bounds.x < minX) minX = d.bounds.x;
            if (d.bounds.y < minY) minY = d.bounds.y;
            if (d.bounds.x + d.bounds.width > maxX) maxX = d.bounds.x + d.bounds.width;
            if (d.bounds.y + d.bounds.height > maxY) maxY = d.bounds.y + d.bounds.height;
        });
        const fullWidth = maxX - minX;
        const fullHeight = maxY - minY;
        
        stealthCursorWindow = new BrowserWindow({
            x: minX, y: minY, width: fullWidth, height: fullHeight,
            transparent: true, frame: false, alwaysOnTop: true,
            skipTaskbar: true, hasShadow: false, focusable: false, show: false,
            webPreferences: { nodeIntegration: true, contextIsolation: false }
        });
        stealthCursorWindow.setIgnoreMouseEvents(true, { forward: true });
        stealthCursorWindow.setAlwaysOnTop(true, 'screen-saver', 99);
        stealthCursorWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

        const stealthHtml = `
            <html><body style="margin:0;overflow:hidden;">
            <div id="cursor" style="position:absolute; width:16px; height:16px; background-image:url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSJyZWQiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIgZD0iTTUuNSAzLjIxVjIwLjhjMCAuNDUuNTQuNjcuODUuMzVsNC44Ni00Ljg2YS41LjUgMCAwIDEgLjM1LS4xNWg2Ljg3Yy40NSAwIC42Ny0uNTQuMzUtLjg1TDYuMzUgMi44NmEuNS41IDAgMCAwLS44NS4zNVoiLz48L3N2Zz4='); background-size:contain; background-repeat:no-repeat; pointer-events:none; z-index:999999; transform:translate(-100px,-100px);"></div>
            <script>
                const { ipcRenderer } = require('electron');
                const cursor = document.getElementById('cursor');
                ipcRenderer.on('move-stealth-cursor-global', (_, pos) => {
                    cursor.style.transform = \`translate(\${pos.x}px, \${pos.y}px)\`;
                });
                ipcRenderer.on('update-stealth-cursor-style-global', (_, type) => {
                    if (type === 'pointer') { cursor.style.cursor = 'pointer'; }
                    else if (type === 'text') { cursor.style.cursor = 'text'; }
                    else { cursor.style.cursor = 'default'; }
                });
            </script>
            </body></html>
        `;
        stealthCursorWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(stealthHtml)}`);
    }
    
    if (!keyupWindow || keyupWindow.isDestroyed()) {
        keyupWindow = new BrowserWindow({
            width: 10, height: 10, transparent: true, frame: false, focusable: true, alwaysOnTop: true, skipTaskbar: true, show: false,
            webPreferences: { nodeIntegration: true, contextIsolation: false }
        });
        const html = `<html><body><script>
            const { ipcRenderer } = require('electron');
            window.addEventListener('keyup', (e) => {
                if (e.key.toLowerCase() === 'a' || e.key === 'Alt') {
                    ipcRenderer.send('stealth-stop-momentary');
                }
            });
        </script></body></html>`;
        keyupWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`);
    }
}
let preStealthMouseEventsIgnored = true;
let mainWindowId = null;
let sessionWindowId = null;

const enforceStealthTop = () => {
    if (stealthCursorWindow && !stealthCursorWindow.isDestroyed()) {
        stealthCursorWindow.moveTop();
    }
};

const DEFAULT_MAIN_WINDOW_SIZE = { width: 1050, height: 800 };
const DEFAULT_SESSION_WINDOW_SIZE = { width: 550, height: 500 };
const MIN_WINDOW_SIZE = { width: 400, height: 300 };

function createWindow(sendToRenderer, geminiSessionRef) {
    const config = storage.getConfig();
    let windowWidth = config.mainWindowWidth || DEFAULT_MAIN_WINDOW_SIZE.width;
    let windowHeight = config.mainWindowHeight || DEFAULT_MAIN_WINDOW_SIZE.height;

    initHiddenWindows();
    const mainWindow = new BrowserWindow({
        width: windowWidth,
        height: windowHeight,
        minWidth: MIN_WINDOW_SIZE.width,
        minHeight: MIN_WINDOW_SIZE.height,
        resizable: true,
        frame: false,
        title: 'HideWin',
        skipTaskbar: false,
        transparent: true,
        hasShadow: true,
        alwaysOnTop: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webviewTag: true,
            // TODO: change to true
            backgroundThrottling: false,
            autoplayPolicy: 'no-user-gesture-required',
            enableBlinkFeatures: 'GetDisplayMedia',
            webSecurity: true,
            allowRunningInsecureContent: false,
            devTools: false, // Prevent Ctrl+Shift+I / F12 from opening DevTools
        },
        backgroundColor: '#00000000',
    });

    mainWindow.setIgnoreMouseEvents(false);

    const { session, desktopCapturer } = require('electron');
    session.defaultSession.setDisplayMediaRequestHandler(
        (request, callback) => {
            desktopCapturer.getSources({ types: ['screen'] }).then(sources => {
                callback({ video: sources[0], audio: 'loopback' });
            });
        },
        { useSystemPicker: true }
    );

    mainWindow.setContentProtection(true);
    mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

    // Hide from Windows taskbar
    if (process.platform === 'win32') {
        try {
            mainWindow.setSkipTaskbar(true);
        } catch (error) {
            console.warn('Could not hide from taskbar:', error.message);
        }
    }

    // Hide from Mission Control on macOS
    if (process.platform === 'darwin') {
        try {
            mainWindow.setHiddenInMissionControl(true);
        } catch (error) {
            console.warn('Could not hide from Mission Control:', error.message);
        }
    }

    if (process.platform === 'win32') {
        mainWindowId = mainWindow.webContents.id;
        mainWindow.setAlwaysOnTop(true, 'floating');
    }

    // Ensure session window restores if main window is restored
    mainWindow.on('restore', () => {
        const { BrowserWindow } = require('electron');
        const windows = BrowserWindow.getAllWindows();
        windows.forEach(win => {
            if (!win.isDestroyed() && win.webContents.id === sessionWindowId) {
                if (win.isMinimized()) win.restore();
            }
        });
    });

    mainWindow.on('focus', enforceStealthTop);

    mainWindow.loadFile(path.join(__dirname, '../index.html'));



    // After window is created, initialize keybinds
    mainWindow.webContents.once('dom-ready', () => {
        setTimeout(() => {
            const defaultKeybinds = getDefaultKeybinds();
            let keybinds = defaultKeybinds;

            // Load keybinds from storage
            const savedKeybinds = storage.getKeybinds();
            if (savedKeybinds) {
                keybinds = { ...defaultKeybinds, ...savedKeybinds };
            }

            updateGlobalShortcuts(keybinds, mainWindow, sendToRenderer, geminiSessionRef);
        }, 150);
    });

    // We only need setupWindowIpcHandlers for mouse interactions
    setupWindowIpcHandlers(sendToRenderer, geminiSessionRef);

    return mainWindow;
}

function createSessionWindow(sendToRenderer, geminiSessionRef, options = {}) {
    const config = storage.getConfig();
    let windowWidth = config.sessionWindowWidth || DEFAULT_SESSION_WINDOW_SIZE.width;
    let windowHeight = config.sessionWindowHeight || DEFAULT_SESSION_WINDOW_SIZE.height;

    const sessionWindow = new BrowserWindow({
        width: windowWidth,
        height: windowHeight,
        minWidth: MIN_WINDOW_SIZE.width,
        minHeight: MIN_WINDOW_SIZE.height,
        resizable: false,
        thickFrame: false,
        frame: false,
        title: 'HideWin Session',
        skipTaskbar: true,
        transparent: true,
        hasShadow: false,
        alwaysOnTop: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            backgroundThrottling: false,
            autoplayPolicy: 'no-user-gesture-required',
            enableBlinkFeatures: 'GetDisplayMedia',
            webSecurity: true,
            allowRunningInsecureContent: false,
            devTools: false,
            additionalArguments: ['--windowType=session']
        },
        backgroundColor: '#00000000',
    });

    sessionWindowId = sessionWindow.webContents.id;

    sessionWindow.setIgnoreMouseEvents(false);
    sessionWindow.setContentProtection(true);
    sessionWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

    if (process.platform === 'win32') {
        try { sessionWindow.setSkipTaskbar(true); } catch (e) {}
        sessionWindow.setAlwaysOnTop(true, 'pop-up-menu');
    }
    if (process.platform === 'darwin') {
        try { sessionWindow.setHiddenInMissionControl(true); } catch (e) {}
    }

    sessionWindow.loadFile(path.join(__dirname, '../index.html'), { 
        query: { 
            windowType: 'session',
            ...options 
        } 
    });

    sessionWindow.webContents.once('dom-ready', () => {
        setTimeout(() => {
            let keybinds = { ...getDefaultKeybinds(), ...(storage.getKeybinds() || {}) };
            updateGlobalShortcuts(keybinds, sessionWindow, sendToRenderer, geminiSessionRef);
        }, 150);
    });

    // Re-use IPC handlers if needed, though most are handled globally in index.js
    // We only need setupWindowIpcHandlers for mouse interactions
    setupWindowIpcHandlers(sendToRenderer, geminiSessionRef);

    return sessionWindow;
}

function getDefaultKeybinds() {
    const isMac = process.platform === 'darwin';
    return {
        moveUp: isMac ? 'Alt+Up' : 'Ctrl+Up',
        moveDown: isMac ? 'Alt+Down' : 'Ctrl+Down',
        moveLeft: isMac ? 'Alt+Left' : 'Ctrl+Left',
        moveRight: isMac ? 'Alt+Right' : 'Ctrl+Right',
        toggleVisibility: isMac ? 'Cmd+\\' : 'Ctrl+\\',
        toggleClickThrough: isMac ? 'Cmd+/' : 'Ctrl+/',
        setMouseDetectable: isMac ? 'Cmd+Alt+A' : 'Ctrl+Alt+A',
        setMouseUndetectable: isMac ? 'Cmd+Alt+S' : 'Ctrl+Alt+S',
        bossKey: isMac ? 'Cmd+Shift+X' : 'Ctrl+Shift+X',
        emergencyErase: isMac ? 'Cmd+Shift+E' : 'Ctrl+Shift+E',
        toggleMouseVisibility: isMac ? 'Cmd+Alt+M' : 'Alt+M',
        momentaryStealth: isMac ? 'Cmd+Alt+A' : 'Alt+A',
        nextStep: isMac ? 'Cmd+Enter' : 'Ctrl+Enter',
        previousResponse: isMac ? 'Cmd+P' : 'Ctrl+P',
        nextResponse: isMac ? 'Cmd+N' : 'Ctrl+N',
        scrollUp: isMac ? 'Alt+Shift+Up' : 'Alt+Up',
        scrollDown: isMac ? 'Alt+Shift+Down' : 'Alt+Down',
        scrollLeft: isMac ? 'Alt+Shift+Left' : 'Alt+Left',
        scrollRight: isMac ? 'Alt+Shift+Right' : 'Alt+Right',
        resizeUp: 'Shift+Up',
        resizeDown: 'Shift+Down',
        resizeLeft: 'Shift+Left',
        resizeRight: 'Shift+Right',
        extendUp: isMac ? 'Cmd+E+Up' : 'Ctrl+E+Up',
        extendDown: isMac ? 'Cmd+E+Down' : 'Ctrl+E+Down',
        extendLeft: isMac ? 'Cmd+E+Left' : 'Ctrl+E+Left',
        extendRight: isMac ? 'Cmd+E+Right' : 'Ctrl+E+Right',
        decreaseUp: isMac ? 'Cmd+D+Up' : 'Ctrl+D+Up',
        decreaseDown: isMac ? 'Cmd+D+Down' : 'Ctrl+D+Down',
        decreaseLeft: isMac ? 'Cmd+D+Left' : 'Ctrl+D+Left',
        decreaseRight: isMac ? 'Cmd+D+Right' : 'Ctrl+D+Right',
        emergencyErase: isMac ? 'Cmd+Shift+E' : 'Ctrl+Shift+E',
    };
}

function updateGlobalShortcuts(keybinds, mainWindow, sendToRenderer, geminiSessionRef) {
    const isMac = process.platform === 'darwin';
    // Auto-migrate conflicting keybinds
    if (keybinds.setMouseDetectable === 'Cmd+A' || keybinds.setMouseDetectable === 'Ctrl+A') {
        keybinds.setMouseDetectable = isMac ? 'Cmd+Alt+A' : 'Ctrl+Alt+A';
        try { require('../storage').setKeybinds(keybinds); } catch(e){}
    }
    if (keybinds.setMouseUndetectable === 'Cmd+S' || keybinds.setMouseUndetectable === 'Ctrl+S') {
        keybinds.setMouseUndetectable = isMac ? 'Cmd+Alt+S' : 'Ctrl+Alt+S';
        try { require('../storage').setKeybinds(keybinds); } catch(e){}
    }

    console.log('Updating global shortcuts with:', keybinds);

    // Unregister all existing shortcuts
    globalShortcut.unregisterAll();

    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;
    const moveIncrement = Math.floor(Math.min(width, height) * 0.1);

    const movementActions = {
        moveUp: () => {
            if (!mainWindow || mainWindow.isDestroyed() || !mainWindow.isVisible()) return;
            const [currentX, currentY] = mainWindow.getPosition();
            mainWindow.setPosition(currentX, currentY - moveIncrement);
        },
        moveDown: () => {
            if (!mainWindow || mainWindow.isDestroyed() || !mainWindow.isVisible()) return;
            const [currentX, currentY] = mainWindow.getPosition();
            mainWindow.setPosition(currentX, currentY + moveIncrement);
        },
        moveLeft: () => {
            if (!mainWindow || mainWindow.isDestroyed() || !mainWindow.isVisible()) return;
            const [currentX, currentY] = mainWindow.getPosition();
            mainWindow.setPosition(currentX - moveIncrement, currentY);
        },
        moveRight: () => {
            if (!mainWindow || mainWindow.isDestroyed() || !mainWindow.isVisible()) return;
            const [currentX, currentY] = mainWindow.getPosition();
            mainWindow.setPosition(currentX + moveIncrement, currentY);
        },
    };

    Object.keys(movementActions).forEach(action => {
        const keybind = keybinds[action];
        if (keybind) {
            try {
                globalShortcut.register(keybind, movementActions[action]);
                console.log(`Registered ${action}: ${keybind}`);
            } catch (error) {
                console.error(`Failed to register ${action} (${keybind}):`, error);
            }
        }
    });

    // Register toggle visibility shortcut
    if (keybinds.toggleVisibility) {
        try {
            globalShortcut.register(keybinds.toggleVisibility, () => {
                if (!mainWindow || mainWindow.isDestroyed()) return;
                if (mainWindow.isVisible()) {
                    if (typeof stealthActive !== 'undefined' && stealthActive) {
                        stealthPaused = true;
                        stopStealthMode();
                    }
                    mainWindow.hide();
                    mainWindow.setSkipTaskbar(true);
                } else {
                    mainWindow.show();
                    mainWindow.setSkipTaskbar(false);
                    mainWindow.focus();
                    try {
                        const { setupTray } = require('./tray');
                        setupTray(mainWindow);
                    } catch(e) {}
                    if (mainWindow.webContents) {
                        mainWindow.webContents.invalidate();
                    }
                    if (typeof stealthPaused !== 'undefined' && stealthPaused) {
                        stealthPaused = false;
                        stealthActive = true;
                        startStealthMode();
                    }
                }
            });
            console.log(`Registered toggleVisibility: ${keybinds.toggleVisibility}`);
        } catch (error) {
            console.error(`Failed to register toggleVisibility (${keybinds.toggleVisibility}):`, error);
        }
    }

    // Register set detectable shortcut
    if (keybinds.setMouseDetectable) {
        try {
            globalShortcut.register(keybinds.setMouseDetectable, () => {
                if (mouseEventsIgnored) {
                    mouseEventsIgnored = false;
                    mainWindow.setIgnoreMouseEvents(false);
                    console.log('Mouse events enabled via Ctrl+A');
                    
                    if (typeof stealthActive !== 'undefined' && stealthActive) {
                        stealthActive = false;
                        stopStealthMode();
                        mainWindow.webContents.send('toggle-mouse-visibility');
                    }
                    mainWindow.webContents.send('click-through-toggled', false);
                }
            });
            console.log(`Registered setMouseDetectable: ${keybinds.setMouseDetectable}`);
        } catch (error) {
            console.error(`Failed to register setMouseDetectable:`, error);
        }
    }


    // Panic Boss Key
    if (keybinds.bossKey) {
        try {
            globalShortcut.register(keybinds.bossKey, () => {
                console.log('PANIC BOSS KEY ACTIVATED!');
                if (mainWindow && !mainWindow.isDestroyed()) {
                    if (typeof stealthActive !== 'undefined' && stealthActive) {
                        stealthActive = false;
                        stopStealthMode();
                    }
                    mainWindow.hide();
                    mainWindow.setSkipTaskbar(true);
                    
                    // Kill audio capture by destroying gemini session
                    if (geminiSessionRef && geminiSessionRef.current) {
                        try {
                            const gemini = require('./gemini');
                            gemini.disconnectGemini(sendToRenderer, geminiSessionRef);
                        } catch(e) {}
                    }
                    
                    // Destroy Tray
                    try {
                        const { destroyTray } = require('./tray');
                        destroyTray();
                    } catch(e) {}
                }
            });
            console.log(`Registered bossKey: ${keybinds.bossKey}`);
        } catch (error) {
            console.error(`Failed to register bossKey:`, error);
        }
    }

    // Emergency Erase
    if (keybinds.emergencyErase) {
        try {
            globalShortcut.register(keybinds.emergencyErase, () => {
                console.log('EMERGENCY ERASE ACTIVATED!');
                try {
                    // Tell renderer to clear local state
                    if (mainWindow && !mainWindow.isDestroyed()) {
                        mainWindow.webContents.send('emergency-erase');
                    }
                    
                    // Clear backend storage
                    const storage = require('../storage');
                    storage.clearAll();
                    
                    // Force quit
                    const { app } = require('electron');
                    app.isQuiting = true;
                    app.quit();
                } catch(e) {
                    console.error('Emergency erase error', e);
                }
            });
            console.log(`Registered emergencyErase: ${keybinds.emergencyErase}`);
        } catch (error) {
            console.error(`Failed to register emergencyErase:`, error);
        }
    }

    // Register set undetectable shortcut
    if (keybinds.setMouseUndetectable) {
        try {
            globalShortcut.register(keybinds.setMouseUndetectable, () => {
                if (!mouseEventsIgnored) {
                    mouseEventsIgnored = true;
                    mainWindow.setIgnoreMouseEvents(true, { forward: true });
                    console.log('Mouse events ignored via Ctrl+S');
                    mainWindow.webContents.send('click-through-toggled', true);
                    
                    if (typeof stealthActive !== 'undefined' && stealthActive) {
                        stealthActive = false;
                        stopStealthMode();
                        mainWindow.webContents.send('toggle-mouse-visibility');
                    }
                }
            });
            console.log(`Registered setMouseUndetectable: ${keybinds.setMouseUndetectable}`);
        } catch (error) {
            console.error(`Failed to register setMouseUndetectable:`, error);
        }
    }

    // ──────────────────────────────────────────────────────────────
    //  STEALTH MODE  (Ctrl+Alt+M)  — MouseBlocker.exe approach
    //
    //  ON  (first Ctrl+Alt+M):
    //  1. Capture the current real cursor screen position.
    //  2. Launch MouseBlocker.exe with frozenX frozenY as args.
    //     MouseBlocker installs a WH_MOUSE_LL hook + a 200-Hz pin
    //     thread that calls SetCursorPos(frozenX, frozenY) so the OS
    //     cursor is physically frozen at that pixel.
    //  3. MouseBlocker writes to stdout:
    //       "MOVE:dx,dy"  — cumulative delta from the frozen point
    //       "LDOWN"/"LUP" — left button events
    //       "RDOWN"/"RUP" — right button events
    //       "WHEEL:n"     — scroll delta
    //  4. We read those lines and:
    //       - Send 'move-stealth-cursor' → renderer moves the red dot
    //       - Forward click/scroll as stealth IPC events
    //  5. Hide the OS cursor via Python (SetSystemCursor blank).
    //
    //  OFF (second Ctrl+Alt+M):
    //  1. Kill MouseBlocker → hook removed, cursor free again.
    //  2. Restore OS cursor via Python
    if (!blockerExePath) {
        blockerExePath = path.join(__dirname, 'MouseBlocker.exe');
        if (blockerExePath.includes('app.asar')) {
            const tempPath = path.join(os.tmpdir(), 'HideWin_MouseBlocker.exe');
            try {
                fs.copyFileSync(blockerExePath, tempPath);
                blockerExePath = tempPath;
                console.log('Extracted MouseBlocker.exe to temp folder:', tempPath);
            } catch (e) {
                console.error('Failed to extract MouseBlocker.exe from ASAR:', e);
            }
        }
    }

    const { ipcMain } = require('electron');

    ipcMain.removeAllListeners('stealth-stop-momentary');
    ipcMain.on('stealth-stop-momentary', () => {
        if (stealthActive) {
            stealthActive = false;
            stopStealthMode();
            const windows = require('electron').BrowserWindow.getAllWindows();
            windows.forEach(win => {
                if (!win.isDestroyed()) win.webContents.send('toggle-mouse-visibility');
            });
            
            if (preStealthMouseEventsIgnored && !mouseEventsIgnored) {
                mouseEventsIgnored = true;
                windows.forEach(win => {
                    if (!win.isDestroyed() && win !== stealthCursorWindow && win !== keyupWindow) {
                        win.setIgnoreMouseEvents(true, { forward: true });
                        win.webContents.send('click-through-toggled', true);
                    }
                });
            }
        }
    });
    ipcMain.removeAllListeners('update-stealth-cursor-style');
    ipcMain.on('update-stealth-cursor-style', (_, cursorType) => {
        if (stealthCursorWindow && !stealthCursorWindow.isDestroyed()) {
            stealthCursorWindow.webContents.send('update-stealth-cursor-style-global', cursorType);
        }
    });

    const ensureBlockerProcess = () => {
        if (blockerProcess) return;
        const { spawn } = require('child_process');
        blockerProcess = spawn(blockerExePath, [], { stdio: ['pipe', 'pipe', 'pipe'], windowsHide: true });
        
        let lineBuffer = '';
        blockerProcess.stdout.on('data', (chunk) => {
            lineBuffer += chunk.toString();
            const lines = lineBuffer.split('\n');
            lineBuffer = lines.pop();

            const { screen } = require('electron');
            const displays = screen.getAllDisplays();
            let minX = 0, minY = 0;
            displays.forEach(d => {
                if (d.bounds.x < minX) minX = d.bounds.x;
                if (d.bounds.y < minY) minY = d.bounds.y;
            });

            for (const raw of lines) {
                const line = raw.trim();
                if (!line || line === 'STARTED') continue;

                if (line === 'LDOWN' || line === 'LUP' || line === 'RDOWN' || line === 'RUP') {
                    const isDown = line.endsWith('DOWN');
                    const button = line.startsWith('L') ? 'left' : 'right';

                    const dotX = frozenScreenX + redDotDX;
                    const dotY = frozenScreenY + redDotDY;
                    
                    const windows = require('electron').BrowserWindow.getAllWindows();
                    let clickedApp = false;
                    windows.forEach(win => {
                        if (win.isDestroyed() || !win.isVisible() || win === stealthCursorWindow || win === keyupWindow) return;
                        const b = win.getContentBounds();
                        if (dotX >= b.x && dotX <= b.x + b.width && dotY >= b.y && dotY <= b.y + b.height) {
                            clickedApp = true;
                            if (isDown) {
                                win.webContents.send('stealth-click-at', { x: dotX - b.x, y: dotY - b.y });
                                setTimeout(() => {
                                    if (stealthCursorWindow && !stealthCursorWindow.isDestroyed()) {
                                        stealthCursorWindow.moveTop();
                                    }
                                }, 50);
                            }
                        }
                    });
                    
                    if (!clickedApp) {
                        if (blockerProcess && blockerProcess.stdin) {
                            blockerProcess.stdin.write(`CLICK:${dotX},${dotY},${isDown ? 'down' : 'up'},${button},${frozenScreenX},${frozenScreenY}\n`);
                        }
                    }
                } else if (line.startsWith('WHEEL:')) {
                    const delta = parseInt(line.split(':')[1], 10);
                    const notches = Math.round(delta / 120);
                    if (notches !== 0) {
                        const dotX = frozenScreenX + redDotDX;
                        const dotY = frozenScreenY + redDotDY;
                        if (blockerProcess && blockerProcess.stdin) {
                            blockerProcess.stdin.write(`SCROLL:${notches},${dotX},${dotY},${frozenScreenX},${frozenScreenY}\n`);
                        }
                    }
                } else if (line.startsWith('MOVE:')) {
                    const parts = line.substring(5).split(',');
                    if (parts.length === 2) {
                        redDotDX = parseInt(parts[0], 10);
                        redDotDY = parseInt(parts[1], 10);
                        if (stealthCursorWindow && !stealthCursorWindow.isDestroyed()) {
                            stealthCursorWindow.webContents.send('move-stealth-cursor-global', {
                                x: (frozenScreenX + redDotDX) - minX,
                                y: (frozenScreenY + redDotDY) - minY
                            });
                        }
                    }
                }
            }
        });
        
        blockerProcess.on('exit', () => { blockerProcess = null; });
        
        require('electron').app.on('will-quit', () => {
            if (blockerProcess) {
                try { blockerProcess.stdin.write("UNLOCK\n"); } catch (e) {}
                try { blockerProcess.kill(); } catch (e) {}
            }
        });
    };

    const startStealthMode = () => {
        const { BrowserWindow, screen } = require('electron');
        const windows = BrowserWindow.getAllWindows();
        windows.forEach(win => {
            if (win.webContents.id === sessionWindowId && !win.isDestroyed()) {
                if (win.isMinimized()) win.restore();
            }
        });

        const curPos = screen.getCursorScreenPoint();
        frozenScreenX = curPos.x;
        frozenScreenY = curPos.y;
        redDotDX = 0;
        redDotDY = 0;

        try {
            if (!stealthCursorWindow || stealthCursorWindow.isDestroyed()) initHiddenWindows();
            
            const displays = screen.getAllDisplays();
            let minX = 0, minY = 0;
            displays.forEach(d => {
                if (d.bounds.x < minX) minX = d.bounds.x;
                if (d.bounds.y < minY) minY = d.bounds.y;
            });

            stealthCursorWindow.webContents.send('move-stealth-cursor-global', {
                x: frozenScreenX - minX,
                y: frozenScreenY - minY
            });
            stealthCursorWindow.setOpacity(1);
            stealthCursorWindow.showInactive();

            ensureBlockerProcess();
            if (blockerProcess && blockerProcess.stdin) {
                blockerProcess.stdin.write("LOCK\n");
            }

            console.log('Stealth ON - cursor locked at', frozenScreenX, frozenScreenY);
        } catch (e) {
            console.error('Failed to start stealth mode:', e);
        }
    };
    const stopStealthMode = () => {
        if (stealthCursorWindow && !stealthCursorWindow.isDestroyed()) {
            stealthCursorWindow.setOpacity(0);
            stealthCursorWindow.webContents.send('move-stealth-cursor-global', { x: -9999, y: -9999 });
            // Do NOT call .hide()! Frameless transparent windows bug out on Windows DWM if hidden and shown repeatedly.
        }
        if (keyupWindow && !keyupWindow.isDestroyed()) {
            keyupWindow.hide();
        }
        
        // INSTANTLY UNLOCK! No killing process!
        if (blockerProcess && blockerProcess.stdin) {
            try { blockerProcess.stdin.write("UNLOCK\n"); } catch (e) {}
        }
        
        stealthActive = false;
        console.log('Stealth OFF - cursor released');
    };


    if (keybinds.momentaryStealth) {
        try {
            globalShortcut.register(keybinds.momentaryStealth, () => {
                if (!mainWindow || mainWindow.isDestroyed()) return;
                
                // --- ROBUST BINARY TOGGLE LOGIC (0 or 1) ---
                if (!stealthActive) {
                    // STATE 1: Turn ON Red Arrow, Freeze Real Cursor
                    stealthActive = true;
                    
                    const windows = require('electron').BrowserWindow.getAllWindows();
                    windows.forEach(win => {
                        if (!win.isDestroyed()) win.webContents.send('toggle-mouse-visibility');
                    });
                    
                    startStealthMode();
                    console.log("Alt+A: STATE 1 (Red Arrow ON, Real Mouse FROZEN)");
                } else {
                    // STATE 0: Turn OFF Red Arrow, Unfreeze Real Cursor
                    stealthActive = false;
                    
                    const windows = require('electron').BrowserWindow.getAllWindows();
                    windows.forEach(win => {
                        if (!win.isDestroyed()) win.webContents.send('toggle-mouse-visibility');
                    });
                    
                    stopStealthMode();
                    console.log("Alt+A: STATE 0 (Red Arrow OFF, Real Mouse FREE)");
                }
            });
            console.log(`Registered momentaryStealth (Toggle): ${keybinds.momentaryStealth}`);
        } catch (e) {
            console.error(`Failed to register momentaryStealth:`, e);
        }
    }

    if (keybinds.toggleMouseVisibility) {
        try {
            globalShortcut.register(keybinds.toggleMouseVisibility, () => {
                if (!mainWindow || mainWindow.isDestroyed()) return;
                if (stealthActive) {
                    const windows = require('electron').BrowserWindow.getAllWindows();
                    windows.forEach(win => { if (!win.isDestroyed()) win.webContents.send('toggle-mouse-visibility'); });
                    stopStealthMode();
                } else {
                    stealthActive = true;
                    const windows = require('electron').BrowserWindow.getAllWindows();
                    windows.forEach(win => {
                        if (!win.isDestroyed()) win.webContents.send('toggle-mouse-visibility');
                    });
                    startStealthMode();
                }
            });
            console.log(`Registered toggleMouseVisibility: ${keybinds.toggleMouseVisibility}`);
        } catch (e) {
            console.error(`Failed to register toggleMouseVisibility:`, e);
        }
    }

    triggerAutoStealthStartFn = () => {
        try {
            ensureBlockerProcess(); // Boot the engine in the background instantly!
        } catch(e) { console.error('Error auto-starting stealth:', e); }
    };

    triggerAutoStealthStopFn = () => {
        try {
            if (blockerProcess && blockerProcess.stdin) {
                try { blockerProcess.stdin.write("UNLOCK\n"); } catch (e) {}
            }
            if (stealthActive) {
                stealthActive = false;
                const windows = require('electron').BrowserWindow.getAllWindows();
                windows.forEach(win => { if (!win.isDestroyed()) win.webContents.send('toggle-mouse-visibility'); });
                stopStealthMode();
            }
        } catch(e) { console.error('Error auto-stopping stealth:', e); }
    };

    // Register next step shortcut (either starts session or takes screenshot based on view)
    if (keybinds.nextStep) {
        try {
            globalShortcut.register(keybinds.nextStep, async () => {
                console.log('Next step shortcut triggered');
                try {
                    // Determine the shortcut key format
                    const isMac = process.platform === 'darwin';
                    const shortcutKey = isMac ? 'cmd+enter' : 'ctrl+enter';

                    // Use the new handleShortcut function
                    mainWindow.webContents.executeJavaScript(`
                        hideWin.handleShortcut('${shortcutKey}');
                    `);
                } catch (error) {
                    console.error('Error handling next step shortcut:', error);
                }
            });
            console.log(`Registered nextStep: ${keybinds.nextStep}`);
        } catch (error) {
            console.error(`Failed to register nextStep (${keybinds.nextStep}):`, error);
        }
    }

    // Register previous response shortcut
    if (keybinds.previousResponse) {
        try {
            globalShortcut.register(keybinds.previousResponse, () => {
                console.log('Previous response shortcut triggered');
                sendToRenderer('navigate-previous-response');
            });
            console.log(`Registered previousResponse: ${keybinds.previousResponse}`);
        } catch (error) {
            console.error(`Failed to register previousResponse (${keybinds.previousResponse}):`, error);
        }
    }

    // Register next response shortcut
    if (keybinds.nextResponse) {
        try {
            globalShortcut.register(keybinds.nextResponse, () => {
                console.log('Next response shortcut triggered');
                sendToRenderer('navigate-next-response');
            });
            console.log(`Registered nextResponse: ${keybinds.nextResponse}`);
        } catch (error) {
            console.error(`Failed to register nextResponse (${keybinds.nextResponse}):`, error);
        }
    }

    // Register scroll up shortcut
    if (keybinds.scrollUp) {
        try {
            globalShortcut.register(keybinds.scrollUp, () => {
                console.log('Scroll up shortcut triggered');
                sendToRenderer('scroll-response-up');
            });
            console.log(`Registered scrollUp: ${keybinds.scrollUp}`);
        } catch (error) {
            console.error(`Failed to register scrollUp (${keybinds.scrollUp}):`, error);
        }
    }

    // Register scroll down shortcut
    if (keybinds.scrollDown) {
        try {
            globalShortcut.register(keybinds.scrollDown, () => {
                console.log('Scroll down shortcut triggered');
                sendToRenderer('scroll-response-down');
            });
            console.log(`Registered scrollDown: ${keybinds.scrollDown}`);
        } catch (error) {
            console.error(`Failed to register scrollDown (${keybinds.scrollDown}):`, error);
        }
    }

    // Register scroll left shortcut
    if (keybinds.scrollLeft) {
        try {
            globalShortcut.register(keybinds.scrollLeft, () => {
                console.log('Scroll left shortcut triggered');
                sendToRenderer('scroll-response-left');
            });
            console.log(`Registered scrollLeft: ${keybinds.scrollLeft}`);
        } catch (error) {
            console.error(`Failed to register scrollLeft (${keybinds.scrollLeft}):`, error);
        }
    }

    // Register scroll right shortcut
    if (keybinds.scrollRight) {
        try {
            globalShortcut.register(keybinds.scrollRight, () => {
                console.log('Scroll right shortcut triggered');
                sendToRenderer('scroll-response-right');
            });
            console.log(`Registered scrollRight: ${keybinds.scrollRight}`);
        } catch (error) {
            console.error(`Failed to register scrollRight (${keybinds.scrollRight}):`, error);
        }
    }

    // Register emergency erase shortcut
    if (keybinds.emergencyErase) {
        try {
            globalShortcut.register(keybinds.emergencyErase, () => {
                console.log('Emergency Erase triggered!');
                if (mainWindow && !mainWindow.isDestroyed()) {
                    mainWindow.hide();

                    if (geminiSessionRef.current) {
                        geminiSessionRef.current.close();
                        geminiSessionRef.current = null;
                    }

                    sendToRenderer('clear-sensitive-data');

                    setTimeout(() => {
                        const { app } = require('electron');
                        app.quit();
                    }, 300);
                }
            });
            console.log(`Registered emergencyErase: ${keybinds.emergencyErase}`);
        } catch (error) {
            console.error(`Failed to register emergencyErase (${keybinds.emergencyErase}):`, error);
        }
    }

    // Register refresh shortcut
    try {
        globalShortcut.register('CommandOrControl+R', () => {
            console.log('Refresh session shortcut triggered');
            sendToRenderer('refresh-session');
        });
        console.log(`Registered Ctrl+R for refresh`);
    } catch (error) {
        console.error('Failed to register Ctrl+R:', error);
    }
}

let triggerAutoStealthStartFn = null;
let triggerAutoStealthStopFn = null;

let isWindowIpcRegistered = false;

function setupWindowIpcHandlers(sendToRenderer, geminiSessionRef) {
    if (isWindowIpcRegistered) return;
    isWindowIpcRegistered = true;

    ipcMain.handle('get-window-bounds', (event) => {
        const win = BrowserWindow.fromWebContents(event.sender);
        if (win && !win.isDestroyed()) {
            return win.getBounds();
        }
        return null;
    });

    ipcMain.handle('window-resize', (event, bounds) => {
        const win = BrowserWindow.fromWebContents(event.sender);
        if (win && !win.isDestroyed()) {
            const current = win.getBounds();
            const merged = { ...current, ...bounds };
            win.setBounds(merged);
        }
    });
    


    ipcMain.handle('resize-window-corner', (event, { x, y, width, height }) => {
        const win = BrowserWindow.fromWebContents(event.sender);
        if (win && !win.isDestroyed()) {
            const newW = Math.max(MIN_WINDOW_SIZE.width, Math.round(width));
            const newH = Math.max(MIN_WINDOW_SIZE.height, Math.round(height));
            win.setBounds({
                x: Math.round(x),
                y: Math.round(y),
                width: newW,
                height: newH
            });
        }
    });

    ipcMain.handle('move-window', (event, { x, y }) => {
        const win = BrowserWindow.fromWebContents(event.sender);
        if (win && !win.isDestroyed()) {
            win.setPosition(Math.round(x), Math.round(y));
        }
    });

    ipcMain.handle('window-minimize', (event) => {
        const win = BrowserWindow.fromWebContents(event.sender);
        if (win && !win.isDestroyed()) {
            win.minimize();
        }
    });

    ipcMain.handle('window-maximize', (event) => {
        const win = BrowserWindow.fromWebContents(event.sender);
        if (win && !win.isDestroyed()) {
            if (win.isMaximized()) {
                win.unmaximize();
            } else {
                win.maximize();
            }
        }
    });

    ipcMain.on('update-keybinds', (event, newKeybinds) => {
        const win = BrowserWindow.fromWebContents(event.sender);
        if (win && !win.isDestroyed()) {
            updateGlobalShortcuts(newKeybinds, win, sendToRenderer, geminiSessionRef);
        }
    });

    ipcMain.handle('toggle-window-visibility', async event => {
        try {
            const win = BrowserWindow.fromWebContents(event.sender);
            if (!win || win.isDestroyed()) {
                return { success: false, error: 'Window has been destroyed' };
            }

            const isVisible = win.isVisible();
            if (isVisible) {
                if (typeof stealthActive !== 'undefined' && stealthActive) {
                    stealthPaused = true;
                    stopStealthMode();
                }
                win.hide();
            } else {
                win.showInactive();
                if (mouseEventsIgnored) {
                    win.setIgnoreMouseEvents(true, { forward: true });
                }
                if (typeof stealthPaused !== 'undefined' && stealthPaused) {
                    stealthPaused = false;
                    stealthActive = true;
                    startStealthMode();
                }
            }
            return { success: true, isVisible: !isVisible };
        } catch (error) {
            console.error('Error in toggle-window-visibility handler:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('set-window-size', (event, { width, height, minWidth = 1, minHeight = 1 }) => {
        const win = BrowserWindow.fromWebContents(event.sender);
        if (win && !win.isDestroyed()) {
            win.setMinimumSize(minWidth, minHeight);
            win.setSize(width, height);
            return { success: true };
        }
        return { success: false };
    });

    ipcMain.handle('set-window-bounds', (event, { x, y, width, height, minWidth = 1, minHeight = 1 }) => {
        const win = BrowserWindow.fromWebContents(event.sender);
        if (win && !win.isDestroyed()) {
            win.setMinimumSize(minWidth, minHeight);
            win.setBounds({ x, y, width, height });
            return { success: true };
        }
        return { success: false };
    });

    ipcMain.handle('minimize-to-bottom-left', (event, { width, height }) => {
        const win = BrowserWindow.fromWebContents(event.sender);
        if (win && !win.isDestroyed()) {
            const { screen } = require('electron');
            const display = screen.getDisplayNearestPoint(win.getBounds());
            const workArea = display.workArea;
            win.setMinimumSize(1, 1);
            win.setBounds({
                x: workArea.x + 20,
                y: workArea.y + workArea.height - height - 20,
                width: width,
                height: height
            });
            return { success: true };
        }
        return { success: false };
    });

    ipcMain.handle('toggle-click-through', (event) => {
        const win = BrowserWindow.fromWebContents(event.sender);
        if (!win || win.isDestroyed()) return;
        
        if (mouseEventsIgnored) {
            mouseEventsIgnored = false;
            win.setIgnoreMouseEvents(false);
            console.log('Mouse events enabled (from UI)');
            
            // If the user clicks the UI switch to "Detectable", make sure Stealth Mode (Red Arrow) turns off too!
            if (typeof stealthActive !== 'undefined' && stealthActive) {
                stealthActive = false;
                stopStealthMode();
                win.webContents.send('toggle-mouse-visibility');
                console.log('Stealth mode turned OFF by UI toggle');
            }
        } else {
            mouseEventsIgnored = true;
            win.setIgnoreMouseEvents(true, { forward: true });
            console.log('Mouse events ignored (from UI)');
            
            // If the user clicks the UI switch to "Undetectable", we MUST also turn off Stealth Mode
            // so they can use their OS cursor to click through!
            if (typeof stealthActive !== 'undefined' && stealthActive) {
                stealthActive = false;
                stopStealthMode();
                win.webContents.send('toggle-mouse-visibility');
                console.log('Stealth mode forcefully turned OFF because app went Undetectable');
            }
        }
        
        win.webContents.send('click-through-toggled', mouseEventsIgnored);
        return mouseEventsIgnored;
    });

    ipcMain.handle('set-ignore-mouse-events', (event, ignore, options) => {
        const win = BrowserWindow.fromWebContents(event.sender);
        if (!win || win.isDestroyed()) return;
        // Only allow temporary hover overrides if the global state is Undetectable
        if (mouseEventsIgnored) {
            win.setIgnoreMouseEvents(ignore, options);
        }
    });

    ipcMain.handle('set-stealth-mode', (event, enable) => {
        const win = BrowserWindow.fromWebContents(event.sender);
        if (!win || win.isDestroyed()) return;
        if (enable) {
            // ── STEALTH ON ──────────────────────────────────────────────────────────
            // Floating overlay level — renders above normal apps, but below stealth cursor
            win.setAlwaysOnTop(true, 'floating');

            // Prevent 3rd-party window managers injecting extra buttons
            win.setMaximizable(false);
            win.setFullScreenable(false);

            if (win.isVisible() && win.webContents) {
                win.webContents.invalidate();
            }
        } else {
            // ── STEALTH OFF ─────────────────────────────────────────────────────────
            // Return to interactive floating overlay
            win.setAlwaysOnTop(true, 'floating');

            if (process.platform === 'win32') {
                win.setSkipTaskbar(false);
            }

            // Restore window capabilities
            win.setMaximizable(true);
            win.setFullScreenable(true);

            if (win.isVisible() && win.webContents) {
                win.webContents.invalidate();
            }
        }
    });

}

module.exports = {
    triggerAutoStealthStart: () => { if(triggerAutoStealthStartFn) triggerAutoStealthStartFn(); },
    triggerAutoStealthStop: () => { if(triggerAutoStealthStopFn) triggerAutoStealthStopFn(); },
    createWindow,
    createSessionWindow,
    getDefaultKeybinds,
    updateGlobalShortcuts,
    setupWindowIpcHandlers,
};
