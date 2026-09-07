const fs = require('fs');
const path = require('path');
const os = require('os');

class PureJSONDatabase {
    constructor() {
        const platform = os.platform();
        let configDir;
        if (platform === 'win32') {
            configDir = path.join(os.homedir(), 'AppData', 'Roaming', 'HideWin');
        } else if (platform === 'darwin') {
            configDir = path.join(os.homedir(), 'Library', 'Application Support', 'HideWin');
        } else {
            configDir = path.join(os.homedir(), '.config', 'HideWin');
        }
        this.dbDir = path.join(configDir, 'db_json');
        if (!fs.existsSync(this.dbDir)) {
            fs.mkdirSync(this.dbDir, { recursive: true });
        }
        this.settingsPath = path.join(this.dbDir, 'settings.json');
        this.credentialsPath = path.join(this.dbDir, 'credentials.json');
        this.conversationsDir = path.join(this.dbDir, 'conversations');
        if (!fs.existsSync(this.conversationsDir)) {
            fs.mkdirSync(this.conversationsDir, { recursive: true });
        }
    }

    initDb() {
        if (!fs.existsSync(this.settingsPath)) fs.writeFileSync(this.settingsPath, JSON.stringify({}));
        if (!fs.existsSync(this.credentialsPath)) fs.writeFileSync(this.credentialsPath, JSON.stringify({}));
    }

    _read(file) {
        try {
            return JSON.parse(fs.readFileSync(file, 'utf8'));
        } catch {
            return {};
        }
    }

    _write(file, data) {
        fs.writeFileSync(file, JSON.stringify(data, null, 2));
    }

    getSetting(key, defaultValue) {
        const data = this._read(this.settingsPath);
        return data[key] !== undefined ? data[key] : defaultValue;
    }

    setSetting(key, value) {
        const data = this._read(this.settingsPath);
        data[key] = value;
        this._write(this.settingsPath, data);
    }

    getCredential(key, defaultValue) {
        const data = this._read(this.credentialsPath);
        return data[key] !== undefined ? data[key] : defaultValue;
    }

    setCredential(key, value) {
        const data = this._read(this.credentialsPath);
        data[key] = value;
        this._write(this.credentialsPath, data);
    }

    saveConversation(sessionData) {
        const id = sessionData.id;
        if (!id) return;
        const filePath = path.join(this.conversationsDir, `${id}.json`);
        this._write(filePath, sessionData);
    }

    getConversation(id) {
        const filePath = path.join(this.conversationsDir, `${id}.json`);
        if (fs.existsSync(filePath)) {
            return this._read(filePath);
        }
        return null;
    }

    getConversations(limit, offset) {
        const files = fs.readdirSync(this.conversationsDir).filter(f => f.endsWith('.json'));
        const sessions = [];
        for (const file of files) {
            const data = this._read(path.join(this.conversationsDir, file));
            if (data && data.id) {
                sessions.push(data);
            }
        }
        sessions.sort((a, b) => b.timestamp - a.timestamp);
        return sessions.slice(offset, offset + limit);
    }

    deleteConversation(id) {
        const filePath = path.join(this.conversationsDir, `${id}.json`);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }

    clearAllData() {
        if (fs.existsSync(this.settingsPath)) fs.unlinkSync(this.settingsPath);
        if (fs.existsSync(this.credentialsPath)) fs.unlinkSync(this.credentialsPath);
        const files = fs.readdirSync(this.conversationsDir);
        for (const file of files) {
            fs.unlinkSync(path.join(this.conversationsDir, file));
        }
    }
}

module.exports = new PureJSONDatabase();
