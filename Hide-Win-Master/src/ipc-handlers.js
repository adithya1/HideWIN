'use strict';
// IPC handler registrations extracted from index.js

const { ipcMain, shell, dialog, app } = require('electron');
const path = require('path');
const storage = require('./storage');

function setupStorageIpcHandlers() {
    // ============ CONFIG ============
    ipcMain.handle('storage:get-config', async () => {
        try {
            return { success: true, data: storage.getConfig() };
        } catch (error) {
            console.error('Error getting config:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('storage:set-config', async (event, config) => {
        try {
            storage.setConfig(config);
            return { success: true };
        } catch (error) {
            console.error('Error setting config:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('storage:update-config', async (event, key, value) => {
        try {
            storage.updateConfig(key, value);
            return { success: true };
        } catch (error) {
            console.error('Error updating config:', error);
            return { success: false, error: error.message };
        }
    });

    // ============ CONVERTER ============
    ipcMain.handle('convert-to-pdf', async (event, filePath) => {
        try {
            const { convertToPdf } = require('./utils/converter');
            const pdfPath = await convertToPdf(filePath);
            return { success: true, pdfPath };
        } catch (error) {
            console.error('Error converting to PDF:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('convert-excel-to-html', async (event, filePath) => {
        try {
            const XLSX = require('xlsx');
            const workbook = XLSX.readFile(filePath);
            // Convert first sheet to HTML table
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const htmlStr = XLSX.utils.sheet_to_html(worksheet);
            return { success: true, html: htmlStr };
        } catch (error) {
            console.error('Error converting Excel to HTML:', error);
            return { success: false, error: error.message };
        }
    });

    // ============ CREDENTIALS ============
    ipcMain.handle('storage:get-credentials', async () => {
        try {
            return { success: true, data: storage.getCredentials() };
        } catch (error) {
            console.error('Error getting credentials:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('storage:set-credentials', async (event, credentials) => {
        try {
            storage.setCredentials(credentials);
            return { success: true };
        } catch (error) {
            console.error('Error setting credentials:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('storage:get-api-key', async () => {
        try {
            return { success: true, data: storage.getApiKey() };
        } catch (error) {
            console.error('Error getting API key:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('storage:set-api-key', async (event, apiKey) => {
        try {
            storage.setApiKey(apiKey);
            return { success: true };
        } catch (error) {
            console.error('Error setting API key:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('storage:get-groq-api-key', async () => {
        try {
            return { success: true, data: storage.getGroqApiKey() };
        } catch (error) {
            console.error('Error getting Groq API key:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('storage:set-groq-api-key', async (event, groqApiKey) => {
        try {
            storage.setGroqApiKey(groqApiKey);
            return { success: true };
        } catch (error) {
            console.error('Error setting Groq API key:', error);
            return { success: false, error: error.message };
        }
    });

    // ============ PREFERENCES ============
    ipcMain.handle('storage:get-preferences', async () => {
        try {
            return { success: true, data: storage.getPreferences() };
        } catch (error) {
            console.error('Error getting preferences:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('storage:set-preferences', async (event, preferences) => {
        try {
            storage.setPreferences(preferences);
            return { success: true };
        } catch (error) {
            console.error('Error setting preferences:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('storage:update-preference', async (event, key, value) => {
        try {
            storage.updatePreference(key, value);
            return { success: true };
        } catch (error) {
            console.error('Error updating preference:', error);
            return { success: false, error: error.message };
        }
    });

    // ============ KEYBINDS ============
    ipcMain.handle('storage:get-keybinds', async () => {
        try {
            return { success: true, data: storage.getKeybinds() };
        } catch (error) {
            console.error('Error getting keybinds:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('storage:set-keybinds', async (event, keybinds) => {
        try {
            storage.setKeybinds(keybinds);
            return { success: true };
        } catch (error) {
            console.error('Error setting keybinds:', error);
            return { success: false, error: error.message };
        }
    });

    // ============ HISTORY ============
    ipcMain.handle('storage:get-all-sessions', async () => {
        try {
            return { success: true, data: storage.getAllSessions() };
        } catch (error) {
            console.error('Error getting sessions:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('storage:get-session', async (event, sessionId) => {
        try {
            return { success: true, data: storage.getSession(sessionId) };
        } catch (error) {
            console.error('Error getting session:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('storage:save-session', async (event, sessionId, data) => {
        console.log('--- STORAGE SAVE SESSION TRIGGERED ---', sessionId);
        try {
            storage.saveSession(sessionId, data);
            return { success: true };
        } catch (error) {
            console.error('Error saving session:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('storage:delete-session', async (event, sessionId) => {
        try {
            storage.deleteSession(sessionId);
            return { success: true };
        } catch (error) {
            console.error('Error deleting session:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('storage:delete-all-sessions', async () => {
        try {
            storage.deleteAllSessions();
            return { success: true };
        } catch (error) {
            console.error('Error deleting all sessions:', error);
            return { success: false, error: error.message };
        }
    });

    // ============ LIMITS ============
    ipcMain.handle('storage:get-today-limits', async () => {
        try {
            return { success: true, data: storage.getTodayLimits() };
        } catch (error) {
            console.error('Error getting today limits:', error);
            return { success: false, error: error.message };
        }
    });

    // ============ NOTES ============
    ipcMain.handle('storage:get-notes', async () => {
        try {
            return { success: true, data: storage.getNotes() };
        } catch (error) {
            console.error('Error getting notes:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('storage:save-notes', async (event, notes) => {
        try {
            storage.saveNotes(notes);
            return { success: true };
        } catch (error) {
            console.error('Error saving notes:', error);
            return { success: false, error: error.message };
        }
    });

    // ============ CLEAR ALL ============
    ipcMain.handle('storage:clear-all', async () => {
        try {
            storage.clearAll();
            return { success: true };
        } catch (error) {
            console.error('Error clearing all data:', error);
            return { success: false, error: error.message };
        }
    });
}

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
                mainWindow.webContents.send('force-restore-main-window');
                
                if (mainWindow.isMinimized()) mainWindow.restore();
                mainWindow.show();
                mainWindow.setAlwaysOnTop(true, "screen-saver");
                mainWindow.focus();
                try { app.focus(); } catch(e) {}
                
                mainWindow.webContents.send('session-status-changed', { state: sessionState, startTime: sessionStartTime });

                setTimeout(() => { 
                    if (mainWindow && !mainWindow.isDestroyed()) {
                        mainWindow.setAlwaysOnTop(false); 
                    }
                    if (sessionWindow && !sessionWindow.isDestroyed()) {
                        sessionWindow.destroy();
                        sessionWindow = null;
                    }
                }, 150);
            } else {
                if (sessionWindow && !sessionWindow.isDestroyed()) {
                    sessionWindow.destroy();
                    sessionWindow = null;
                }
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
            if (sessionWindow && !sessionWindow.isDestroyed()) {
                sessionWindow.destroy();  // Bug #5 fix: destroy so session can be restarted
                sessionWindow = null;
            }
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



module.exports = { setupStorageIpcHandlers, setupGeneralIpcHandlers };
