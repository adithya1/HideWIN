const fs = require('fs');
const path = require('path');
const os = require('os');
const db = require('./utils/db');

const CONFIG_VERSION = 1;

// Default values
const DEFAULT_CONFIG = {
    configVersion: CONFIG_VERSION,
    onboarded: false,
    layout: 'normal',
    mainWindowWidth: 950,
    mainWindowHeight: 700,
    sessionWindowWidth: 550,
    sessionWindowHeight: 500
};

const DEFAULT_CREDENTIALS = {
    jwtToken: '',
    hashkey: '',
    user: null
};

const DEFAULT_PREFERENCES = {
    customPrompt: '',
    providerMode: 'byok',
    selectedProfile: 'interview',
    selectedLanguage: 'en-US',
    selectedScreenshotInterval: '5',
    selectedImageQuality: 'medium',
    advancedMode: false,
    audioMode: 'both',
    fontSize: 'medium',
    backgroundTransparency: 0.8,
    googleSearchEnabled: false,
    ollamaHost: 'http://127.0.0.1:11434',
    ollamaModel: 'llama3.1',
    whisperModel: 'Xenova/whisper-small',
    autoScroll: true,
    userFullName: 'User',
    userEmail: 'user@example.com',
    themeMain: 'light',
    themeSession: 'dark',
    transparencyMain: 0.95,
    transparencySession: 0.3,
    fontSizeMain: 14,
    fontSizeSession: 14,
    stealthCursorStyle: 'native',
    pureStealthMode: false,
};

const DEFAULT_KEYBINDS = {};

function getConfigDir() {
    const isWindows = process.platform === 'win32';
    if (isWindows) {
        return path.join(process.env.APPDATA, 'HideWin');
    }
    return path.join(os.homedir(), '.hidewin');
}

function initializeStorage() {
    db.initDb();
    const configDir = getConfigDir();
    
    // Migration Logic from JSON -> SQLite
    const migratedFlag = db.getSetting('migratedToSqlite', false);
    if (!migratedFlag) {
        console.log('Migrating legacy JSON storage to SQLite...');
        try {
            const oldConfigPath = path.join(configDir, 'config.json');
            const oldCredsPath = path.join(configDir, 'credentials.json');
            const oldPrefsPath = path.join(configDir, 'preferences.json');
            const oldKeybindsPath = path.join(configDir, 'keybinds.json');
            const oldLimitsPath = path.join(configDir, 'limits.json');
            const oldNotesPath = path.join(configDir, 'notes.json');
            const oldProfilesPath = path.join(configDir, 'profiles.json');
            const historyDir = path.join(configDir, 'history');

            // Migrate JSON to SQLite Setting table
            if (fs.existsSync(oldConfigPath)) db.setSetting('config', JSON.parse(fs.readFileSync(oldConfigPath)));
            if (fs.existsSync(oldPrefsPath)) db.setSetting('preferences', JSON.parse(fs.readFileSync(oldPrefsPath)));
            if (fs.existsSync(oldKeybindsPath)) db.setSetting('keybinds', JSON.parse(fs.readFileSync(oldKeybindsPath)));
            if (fs.existsSync(oldLimitsPath)) db.setSetting('limits', JSON.parse(fs.readFileSync(oldLimitsPath)));
            if (fs.existsSync(oldNotesPath)) db.setSetting('notes', JSON.parse(fs.readFileSync(oldNotesPath)));
            if (fs.existsSync(oldProfilesPath)) db.setSetting('profiles', JSON.parse(fs.readFileSync(oldProfilesPath)));

            // Migrate Credentials
            if (fs.existsSync(oldCredsPath)) {
                const creds = JSON.parse(fs.readFileSync(oldCredsPath));
                for (const [k, v] of Object.entries(creds)) {
                    if (v) db.setCredential(k, v);
                }
            }

            // Migrate History
            if (fs.existsSync(historyDir)) {
                const files = fs.readdirSync(historyDir);
                for (const file of files) {
                    if (file.endsWith('.json')) {
                        const sess = JSON.parse(fs.readFileSync(path.join(historyDir, file)));
                        db.saveConversation(sess);
                    }
                }
            }

            db.setSetting('migratedToSqlite', true);
            console.log('Migration complete!');

            // Optionally, delete the old files here.
            fs.unlinkSync(oldConfigPath);
            if (fs.existsSync(oldCredsPath)) fs.unlinkSync(oldCredsPath);
            if (fs.existsSync(oldPrefsPath)) fs.unlinkSync(oldPrefsPath);
            if (fs.existsSync(oldKeybindsPath)) fs.unlinkSync(oldKeybindsPath);
            if (fs.existsSync(oldLimitsPath)) fs.unlinkSync(oldLimitsPath);
            if (fs.existsSync(oldNotesPath)) fs.unlinkSync(oldNotesPath);
            if (fs.existsSync(oldProfilesPath)) fs.unlinkSync(oldProfilesPath);
            
        } catch(e) {
            console.error('Migration error:', e);
            db.setSetting('migratedToSqlite', true); // Skip to avoid boot loop
        }
    }
}

// ============ CONFIG ============
function getConfig() {
    return { ...DEFAULT_CONFIG, ...(db.getSetting('config', {})) };
}
function setConfig(config) {
    db.setSetting('config', config);
    return true;
}
function updateConfig(updates) {
    const current = getConfig();
    const updated = { ...current, ...updates };
    setConfig(updated);
    return updated;
}

// ============ CREDENTIALS ============
function getCredentials() {
    return {
        jwtToken: db.getCredential('jwtToken', DEFAULT_CREDENTIALS.jwtToken),
        hashkey: db.getCredential('hashkey', DEFAULT_CREDENTIALS.hashkey),
        user: db.getCredential('user', DEFAULT_CREDENTIALS.user)
    };
}
function setCredentials(credentials) {
    for (const [k, v] of Object.entries(credentials)) {
        db.setCredential(k, v);
    }
    return true;
}
function getApiKey() {
    return db.getCredential('apiKey', process.env.GEMINI_API_KEY || '');
}
function setApiKey(apiKey) {
    db.setCredential('apiKey', apiKey);
}
function getGroqApiKey() {
    return db.getCredential('groqApiKey', '');
}
function setGroqApiKey(groqApiKey) {
    db.setCredential('groqApiKey', groqApiKey);
}

// ============ PREFERENCES ============
function getPreferences() {
    return { ...DEFAULT_PREFERENCES, ...(db.getSetting('preferences', {})) };
}
function setPreferences(prefs) {
    db.setSetting('preferences', prefs);
    return true;
}
function updatePreference(key, value) {
    const prefs = getPreferences();
    prefs[key] = value;
    setPreferences(prefs);
    return prefs;
}

// ============ KEYBINDS ============
function getKeybinds() {
    return { ...DEFAULT_KEYBINDS, ...(db.getSetting('keybinds', {})) };
}
function setKeybinds(keybinds) {
    db.setSetting('keybinds', keybinds);
    return true;
}

// ============ LIMITS ============
function getLimits() {
    return db.getSetting('limits', {});
}
function setLimits(limits) {
    db.setSetting('limits', limits);
    return true;
}
function getTodayLimits() {
    const dateStr = new Date().toISOString().split('T')[0];
    const limits = getLimits();
    if (!limits[dateStr]) limits[dateStr] = { queries: 0, chars: 0 };
    return limits[dateStr];
}
function incrementLimitCount() {
    const limits = getLimits();
    const dateStr = new Date().toISOString().split('T')[0];
    if (!limits[dateStr]) limits[dateStr] = { queries: 0, chars: 0 };
    limits[dateStr].queries = (limits[dateStr].queries || 0) + 1;
    setLimits(limits);
    return limits[dateStr].queries;
}
function incrementCharUsage(chars) {
    const limits = getLimits();
    const dateStr = new Date().toISOString().split('T')[0];
    if (!limits[dateStr]) limits[dateStr] = { queries: 0, chars: 0 };
    limits[dateStr].chars = (limits[dateStr].chars || 0) + chars;
    setLimits(limits);
}
const GEMINI_MODEL_FALLBACK_LIST = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.0-flash-lite'];
function getAvailableModel() {
    return GEMINI_MODEL_FALLBACK_LIST[0];
}
function getModelForToday() {
    return getAvailableModel();
}

// ============ HISTORY ============
function saveSession(sessionData) {
    db.saveConversation(sessionData);
}
function getSession(sessionId) {
    return db.getConversation(sessionId);
}
function getAllSessions() {
    return db.getConversations(500, 0); // High limit for UI listing
}
function deleteSession(sessionId) {
    db.deleteConversation(sessionId);
    return true;
}
function deleteAllSessions() {
    // We can just wipe the conversations table
    const database = require('./utils/db');
    database.initDb().exec('DELETE FROM messages; DELETE FROM conversations;');
}

// ============ NOTES ============
function getNotes() {
    return db.getSetting('notes', []);
}
function saveNotes(notes) {
    db.setSetting('notes', notes);
}

// ============ PROFILES ============
function getProfiles() {
    return db.getSetting('profiles', []);
}
function saveProfiles(profiles) {
    db.setSetting('profiles', profiles);
}

function clearAll() {
    db.clearAllData();
}

module.exports = {
    GEMINI_MODEL_FALLBACK_LIST,
    initializeStorage,
    getConfig,
    setConfig,
    updateConfig,
    getCredentials,
    setCredentials,
    getApiKey,
    setApiKey,
    getGroqApiKey,
    setGroqApiKey,
    getPreferences,
    setPreferences,
    updatePreference,
    getKeybinds,
    setKeybinds,
    getLimits,
    setLimits,
    getTodayLimits,
    incrementLimitCount,
    getAvailableModel,
    incrementCharUsage,
    getModelForToday,
    saveSession,
    getSession,
    getAllSessions,
    deleteSession,
    deleteAllSessions,
    getNotes,
    saveNotes,
    getProfiles,
    saveProfiles,
    clearAll
};
