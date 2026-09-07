const fs = require('fs');
const path = require('path');
const os = require('os');

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
    stealthCursorStyle: 'native', // 'arrow' or 'native'
    pureStealthMode: false,
};

const DEFAULT_KEYBINDS = null; // null means use system defaults

const DEFAULT_LIMITS = {
    data: [] // Array of { date: 'YYYY-MM-DD', flash: { count }, flashLite: { count }, groq: { 'qwen3-32b': { chars, limit }, 'gpt-oss-120b': { chars, limit }, 'gpt-oss-20b': { chars, limit } }, gemini: { 'gemma-4-26b-a4b-it': { chars } } }
};

// Get the config directory path based on OS
function getConfigDir() {
    const platform = os.platform();
    let configDir;

    if (platform === 'win32') {
        configDir = path.join(os.homedir(), 'AppData', 'Roaming', 'HideWin');
    } else if (platform === 'darwin') {
        configDir = path.join(os.homedir(), 'Library', 'Application Support', 'HideWin');
    } else {
        configDir = path.join(os.homedir(), '.config', 'HideWin');
    }

    return configDir;
}

// File paths
function getConfigPath() {
    return path.join(getConfigDir(), 'config.json');
}

function getCredentialsPath() {
    return path.join(getConfigDir(), 'credentials.json');
}

function getPreferencesPath() {
    return path.join(getConfigDir(), 'preferences.json');
}

function getKeybindsPath() {
    return path.join(getConfigDir(), 'keybinds.json');
}

function getLimitsPath() {
    return path.join(getConfigDir(), 'limits.json');
}

function getNotesPath() {
    return path.join(getConfigDir(), 'notes.json');
}

function getProfilesPath() {
    return path.join(getConfigDir(), 'profiles.json');
}

function getHistoryDir() {
    return path.join(getConfigDir(), 'history');
}

// Helper to read JSON file safely
function readJsonFile(filePath, defaultValue) {
    try {
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.warn(`Error reading ${filePath}:`, error.message);
    }
    return defaultValue;
}

// Helper to write JSON file safely
function writeJsonFile(filePath, data) {
    try {
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error(`Error writing ${filePath}:`, error.message);
        return false;
    }
}

// Check if we need to reset (no configVersion or wrong version)
function needsReset() {
    const configPath = getConfigPath();
    if (!fs.existsSync(configPath)) {
        return true;
    }

    try {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        return !config.configVersion || config.configVersion !== CONFIG_VERSION;
    } catch {
        return true;
    }
}

// Wipe and reinitialize the config directory
function resetConfigDir() {
    const configDir = getConfigDir();

    console.log('Resetting config directory...');

    // Remove existing directory if it exists, with retry on EBUSY (locked lockfile)
    if (fs.existsSync(configDir)) {
        let retries = 5;
        while (retries > 0) {
            try {
                fs.rmSync(configDir, { recursive: true, force: true });
                break;
            } catch (err) {
                if (err.code === 'EBUSY' && retries > 1) {
                    console.warn(`Config dir busy, retrying... (${retries - 1} attempts left)`);
                    // Synchronous wait: spin for ~200ms
                    const waitUntil = Date.now() + 200;
                    while (Date.now() < waitUntil) { /* busy-wait */ }
                    retries--;
                } else {
                    // On final retry or non-EBUSY error, try deleting file-by-file
                    console.warn(`rmSync failed (${err.code}), attempting file-by-file removal...`);
                    try {
                        const entries = fs.readdirSync(configDir, { withFileTypes: true });
                        for (const entry of entries) {
                            const fullPath = require('path').join(configDir, entry.name);
                            try {
                                if (entry.isDirectory()) {
                                    fs.rmSync(fullPath, { recursive: true, force: true });
                                } else {
                                    fs.unlinkSync(fullPath);
                                }
                            } catch (unlinkErr) {
                                console.warn(`Could not remove ${fullPath}: ${unlinkErr.code}`);
                            }
                        }
                    } catch (readErr) {
                        console.warn(`Could not read config dir for cleanup: ${readErr.message}`);
                    }
                    break;
                }
            }
        }
    }

    // Create fresh directory structure
    fs.mkdirSync(configDir, { recursive: true });
    fs.mkdirSync(getHistoryDir(), { recursive: true });

    // Initialize with defaults
    writeJsonFile(getConfigPath(), DEFAULT_CONFIG);
    writeJsonFile(getCredentialsPath(), DEFAULT_CREDENTIALS);
    writeJsonFile(getPreferencesPath(), DEFAULT_PREFERENCES);

    console.log('Config directory initialized with defaults');
}

// Initialize storage - call this on app startup
function initializeStorage() {
    try {
        if (needsReset()) {
            resetConfigDir();
        } else {
            // Ensure history directory exists
            const historyDir = getHistoryDir();
            if (!fs.existsSync(historyDir)) {
                fs.mkdirSync(historyDir, { recursive: true });
            }
        }
    } catch (err) {
        console.error(`Storage initialization failed: ${err.message}. Attempting recovery...`);
        try {
            // Last-resort: just ensure directories exist and write defaults
            const configDir = getConfigDir();
            fs.mkdirSync(configDir, { recursive: true });
            fs.mkdirSync(getHistoryDir(), { recursive: true });
            writeJsonFile(getConfigPath(), DEFAULT_CONFIG);
            writeJsonFile(getCredentialsPath(), DEFAULT_CREDENTIALS);
            writeJsonFile(getPreferencesPath(), DEFAULT_PREFERENCES);
            console.log('Storage recovery successful.');
        } catch (recoveryErr) {
            console.error(`Storage recovery also failed: ${recoveryErr.message}`);
        }
    }
}

// ============ CONFIG ============

function getConfig() {
    return readJsonFile(getConfigPath(), DEFAULT_CONFIG);
}

function setConfig(config) {
    const current = getConfig();
    const updated = { ...current, ...config, configVersion: CONFIG_VERSION };
    return writeJsonFile(getConfigPath(), updated);
}

function updateConfig(key, value) {
    const config = getConfig();
    config[key] = value;
    return writeJsonFile(getConfigPath(), config);
}

// ============ CREDENTIALS ============

function getCredentials() {
    const creds = readJsonFile(getCredentialsPath(), DEFAULT_CREDENTIALS);
    const { safeStorage } = require('electron');
    
    // Decrypt API keys if safeStorage is available and they are encrypted
    if (safeStorage && safeStorage.isEncryptionAvailable()) {
        const sensitiveKeys = ['apiKey', 'groqApiKey', 'openaiKey'];
        for (const key of sensitiveKeys) {
            if (creds[key] && creds[key].startsWith('enc:')) {
                try {
                    const buffer = Buffer.from(creds[key].substring(4), 'base64');
                    creds[key] = safeStorage.decryptString(buffer);
                } catch (e) {
                    console.warn(`Failed to decrypt ${key}`);
                }
            }
        }
    }
    return creds;
}

function setCredentials(credentials) {
    const current = getCredentials();
    const updated = { ...current };
    const { safeStorage } = require('electron');

    for (const [key, value] of Object.entries(credentials)) {
        if ((key === 'apiKey' || key === 'groqApiKey' || key === 'openaiKey') && value) {
            if (safeStorage && safeStorage.isEncryptionAvailable()) {
                updated[key] = 'enc:' + safeStorage.encryptString(value).toString('base64');
            } else {
                updated[key] = value;
            }
        } else {
            updated[key] = value;
        }
    }

    return writeJsonFile(getCredentialsPath(), updated);
}

function getApiKey() {
    return getCredentials().apiKey || process.env.GEMINI_API_KEY || '';
}

function setApiKey(apiKey) {
    return setCredentials({ apiKey });
}

function getGroqApiKey() {
    return getCredentials().groqApiKey || '';
}

function setGroqApiKey(groqApiKey) {
    return setCredentials({ groqApiKey });
}

// ============ PREFERENCES ============

function getPreferences() {
    const saved = readJsonFile(getPreferencesPath(), {});
    return { ...DEFAULT_PREFERENCES, ...saved };
}

function setPreferences(preferences) {
    const current = getPreferences();
    const updated = { ...current, ...preferences };
    return writeJsonFile(getPreferencesPath(), updated);
}

function updatePreference(key, value) {
    const preferences = getPreferences();
    preferences[key] = value;
    return writeJsonFile(getPreferencesPath(), preferences);
}

// ============ KEYBINDS ============

function getKeybinds() {
    return readJsonFile(getKeybindsPath(), DEFAULT_KEYBINDS);
}

function setKeybinds(keybinds) {
    return writeJsonFile(getKeybindsPath(), keybinds);
}

// ============ LIMITS (Rate Limiting) ============

function getLimits() {
    return readJsonFile(getLimitsPath(), DEFAULT_LIMITS);
}

function setLimits(limits) {
    return writeJsonFile(getLimitsPath(), limits);
}

function getTodayDateString() {
    const now = new Date();
    return now.toISOString().split('T')[0]; // YYYY-MM-DD
}

function getTodayLimits() {
    const limits = getLimits();
    const today = getTodayDateString();

    // Find today's entry
    const todayEntry = limits.data.find(entry => entry.date === today);

    if (todayEntry) {
        // ensure new fields exist
        if(!todayEntry.groq) {
            todayEntry.groq = {
                'qwen3-32b': { chars: 0, limit: 1500000 },
                'gpt-oss-120b': { chars: 0, limit: 600000 },
                'gpt-oss-20b': { chars: 0, limit: 600000 },
                'kimi-k2-instruct': { chars: 0, limit: 600000 }
            };
        }
        if(!todayEntry.gemini) {
            todayEntry.gemini = {
                'gemma-4-26b-a4b-it': { chars: 0 }
            };
        }
        setLimits(limits);
        return todayEntry;
    }

    // No entry for today - clean old entries and create new one
    limits.data = limits.data.filter(entry => entry.date === today);
    const newEntry = {
        date: today,
        flash: { count: 0 },
        flashLite: { count: 0 },
        groq: {
            'qwen3-32b': { chars: 0, limit: 1500000 },
            'gpt-oss-120b': { chars: 0, limit: 600000 },
            'gpt-oss-20b': { chars: 0, limit: 600000 },
            'kimi-k2-instruct': { chars: 0, limit: 600000 }
        },
        gemini: {
            'gemma-4-26b-a4b-it': { chars: 0 }
        }
    };
    limits.data.push(newEntry);
    setLimits(limits);

    return newEntry;
}

function incrementLimitCount(model) {
    const limits = getLimits();
    const today = getTodayDateString();

    // Find or create today's entry
    let todayEntry = limits.data.find(entry => entry.date === today);

    if (!todayEntry) {
        // Clean old entries and create new one
        limits.data = [];
        todayEntry = {
            date: today,
            flash: { count: 0 },
            flashLite: { count: 0 }
        };
        limits.data.push(todayEntry);
    } else {
        // Clean old entries, keep only today
        limits.data = limits.data.filter(entry => entry.date === today);
    }

    // Increment the appropriate model count
    if (model === 'gemini-2.5-flash' || model === 'gemini-2.0-flash' || model === 'gemini-1.5-flash' || model === 'gemini-1.5-flash-8b') {
        todayEntry.flash.count++;
    }

    setLimits(limits);
    return todayEntry;
}

function incrementCharUsage(provider, model, charCount) {
    getTodayLimits();

    const limits = getLimits();
    const today = getTodayDateString();
    const todayEntry = limits.data.find(entry => entry.date === today);

    if(todayEntry[provider] && todayEntry[provider][model]) {
        todayEntry[provider][model].chars += charCount;
        setLimits(limits);
    }

    return todayEntry;
}

// Ordered list of Gemini models to try (most preferred first).
// gemini-2.5-flash-lite has been discontinued — do NOT add it back.
const GEMINI_MODEL_FALLBACK_LIST = [
    'gemini-2.5-flash',
    'gemini-3-flash-preview',
];

function getAvailableModel() {
    const todayLimits = getTodayLimits();

    // Free-tier RPD limit for gemini-2.5-flash is 50/day.
    // Paid users always get flash regardless, so the cap here is just
    // a guard to avoid hammering the free quota unnecessarily.
    if (todayLimits.flash.count < 50) {
        return GEMINI_MODEL_FALLBACK_LIST[0];
    }

    return GEMINI_MODEL_FALLBACK_LIST[0]; // Default: always use flash (paid users)
}

function getModelForToday() {
    const todayEntry = getTodayLimits();
    const groq = todayEntry.groq || {};

    if (groq['llama-3.3-70b-versatile'] && groq['llama-3.3-70b-versatile'].chars >= groq['llama-3.3-70b-versatile'].limit) {
        return 'llama-3.1-8b-instant';
    }
    return 'llama-3.3-70b-versatile';
}

// ============ HISTORY ============

function getSessionPath(sessionId) {
    return path.join(getHistoryDir(), `${sessionId}.json`);
}

function saveSession(sessionId, data) {
    const sessionPath = getSessionPath(sessionId);

    // Load existing session to preserve metadata
    const existingSession = readJsonFile(sessionPath, null);

    const sessionData = {
        sessionId,
        createdAt: existingSession?.createdAt || parseInt(sessionId),
        lastUpdated: Date.now(),
        // Profile context - set once when session starts
        profile: data.profile || existingSession?.profile || null,
        customPrompt: data.customPrompt || existingSession?.customPrompt || null,
        // Conversation data
        conversationHistory: data.conversationHistory || existingSession?.conversationHistory || [],
        screenAnalysisHistory: data.screenAnalysisHistory || existingSession?.screenAnalysisHistory || []
    };
    return writeJsonFile(sessionPath, sessionData);
}

function getSession(sessionId) {
    return readJsonFile(getSessionPath(sessionId), null);
}

function getAllSessions() {
    const historyDir = getHistoryDir();

    try {
        if (!fs.existsSync(historyDir)) {
            return [];
        }

        const files = fs.readdirSync(historyDir)
            .filter(f => f.endsWith('.json'))
            .sort((a, b) => {
                // Sort by timestamp descending (newest first)
                const tsA = parseInt(a.replace('.json', ''));
                const tsB = parseInt(b.replace('.json', ''));
                return tsB - tsA;
            });

        return files.map(file => {
            const sessionId = file.replace('.json', '');
            const data = readJsonFile(path.join(historyDir, file), null);
            if (data) {
                return {
                    sessionId,
                    createdAt: data.createdAt,
                    lastUpdated: data.lastUpdated,
                    messageCount: data.conversationHistory?.length || 0,
                    screenAnalysisCount: data.screenAnalysisHistory?.length || 0,
                    profile: data.profile || null,
                    customPrompt: data.customPrompt || null
                };
            }
            return null;
        }).filter(Boolean);
    } catch (error) {
        console.error('Error reading sessions:', error.message);
        return [];
    }
}

function deleteSession(sessionId) {
    const sessionPath = getSessionPath(sessionId);
    try {
        if (fs.existsSync(sessionPath)) {
            fs.unlinkSync(sessionPath);
            return true;
        }
    } catch (error) {
        console.error('Error deleting session:', error.message);
    }
    return false;
}

function deleteAllSessions() {
    const historyDir = getHistoryDir();
    try {
        if (fs.existsSync(historyDir)) {
            const files = fs.readdirSync(historyDir).filter(f => f.endsWith('.json'));
            files.forEach(file => {
                fs.unlinkSync(path.join(historyDir, file));
            });
        }
        return true;
    } catch (error) {
        console.error('Error deleting all sessions:', error.message);
        return false;
    }
}

function clearAll() {
    try {
        console.log('Clearing all app data...');

        // Clear history directory contents
        const historyDir = getHistoryDir();
        if (fs.existsSync(historyDir)) {
            const files = fs.readdirSync(historyDir);
            for (const file of files) {
                fs.unlinkSync(path.join(historyDir, file));
            }
        }

        // Delete other files but keep config.json with fresh state
        const filesToDelete = [
            getCredentialsPath(),
            getPreferencesPath(),
            getKeybindsPath(),
            getLimitsPath(),
            getNotesPath()
        ];

        for (const file of filesToDelete) {
            if (fs.existsSync(file)) {
                fs.unlinkSync(file);
            }
        }

        // Reset config.json to fully onboarded = false
        const configPath = getConfigPath();
        const config = { ...DEFAULT_CONFIG, onboarded: false };
        writeJsonFile(configPath, config);

        console.log('Successfully cleared all app data');
        return true;
    } catch (error) {
        console.error('Error clearing data:', error);
        throw error;
    }
}

// ==========================================
// Notes Operations
// ==========================================

function getNotes() {
    return readJsonFile(getNotesPath(), []);
}

function saveNotes(notes) {
    return writeJsonFile(getNotesPath(), notes);
}

// ==========================================
// Profile Operations
// ==========================================

const DEFAULT_PROFILES = [];

function getProfiles() {
    const loaded = readJsonFile(getProfilesPath(), null);
    if (!loaded || !Array.isArray(loaded)) {
        writeJsonFile(getProfilesPath(), DEFAULT_PROFILES);
        return DEFAULT_PROFILES;
    }
    return loaded.map((p, idx) => ({ ...p, numericId: p.numericId || (idx + 1), userName: p.userName || p.name || `User #${idx + 1}` }));
}

function saveProfiles(profiles) {
    return writeJsonFile(getProfilesPath(), profiles);
}

module.exports = {
    // Initialization
    initializeStorage,
    GEMINI_MODEL_FALLBACK_LIST,
    getConfigDir,

    // Config
    getConfig,
    setConfig,
    updateConfig,

    // Credentials
    getCredentials,
    setCredentials,
    getApiKey,
    setApiKey,
    getGroqApiKey,
    setGroqApiKey,

    // Preferences
    getPreferences,
    setPreferences,
    updatePreference,

    // Keybinds
    getKeybinds,
    setKeybinds,

    // Limits (Rate Limiting)
    getLimits,
    setLimits,
    getTodayLimits,
    incrementLimitCount,
    getAvailableModel,
    incrementCharUsage,
    getModelForToday,

    // History
    saveSession,
    getSession,
    getAllSessions,
    deleteSession,
    deleteAllSessions,

    // Notes
    getNotes,
    saveNotes,

    // Profiles
    getProfiles,
    saveProfiles,

    // Clear all
    clearAll
};
