const { BrowserWindow, globalShortcut, ipcMain, screen } = require('electron');
const path = require('node:path');
const os = require('os');
const fs = require('fs');
const storage = require('../storage');
const { updateGlobalShortcuts, setupWindowIpcHandlers } = require('./window.shortcuts');

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

// updateGlobalShortcuts -> window.shortcuts.js


let triggerAutoStealthStartFn = null;
let triggerAutoStealthStopFn = null;

let isWindowIpcRegistered = false;

// setupWindowIpcHandlers -> window.shortcuts.js


module.exports = {
    triggerAutoStealthStart: () => { if(triggerAutoStealthStartFn) triggerAutoStealthStartFn(); },
    triggerAutoStealthStop: () => { if(triggerAutoStealthStopFn) triggerAutoStealthStopFn(); },
    createWindow,
    createSessionWindow,
    getDefaultKeybinds,
    updateGlobalShortcuts,
    setupWindowIpcHandlers,
};
