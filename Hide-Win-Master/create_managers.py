import os

config_code = """
const isBrowser = typeof window !== 'undefined';
let storage;

if (isBrowser) {
    if (window.require) {
        storage = window.require('./storage.js');
    }
} else {
    storage = require('../storage.js');
}

function getConfig() {
    if (storage && typeof storage.getConfig === 'function') {
        return storage.getConfig();
    }
    return {};
}

function getWebBaseUrl() {
    const config = getConfig();
    if (config.networkMode === 'cloud' && config.webDomain) {
        let domain = config.webDomain.trim();
        if (!domain.startsWith('http')) domain = 'https://' + domain;
        // Strip trailing slash
        return domain.endsWith('/') ? domain.slice(0, -1) : domain;
    }
    return 'http://localhost:5173';
}

function getApiBaseUrl() {
    const config = getConfig();
    if (config.networkMode === 'cloud' && config.apiDomain) {
        let domain = config.apiDomain.trim();
        if (!domain.startsWith('http')) domain = 'https://' + domain;
        return domain.endsWith('/') ? domain.slice(0, -1) : domain;
    }
    return 'http://localhost:8000';
}

function getWsBaseUrl() {
    const config = getConfig();
    if (config.networkMode === 'cloud' && config.apiDomain) {
        let domain = config.apiDomain.trim();
        if (domain.startsWith('https://')) domain = domain.replace('https://', 'wss://');
        else if (domain.startsWith('http://')) domain = domain.replace('http://', 'ws://');
        else domain = 'wss://' + domain;
        return domain.endsWith('/') ? domain.slice(0, -1) : domain;
    }
    return 'ws://localhost:8000';
}

function getProtocolName() {
    const config = getConfig();
    return config.appProtocol || 'hidewin';
}

module.exports = {
    getWebBaseUrl,
    getApiBaseUrl,
    getWsBaseUrl,
    getProtocolName,
    getConfig
};
"""

with open('src/utils/configManager.js', 'w', encoding='utf-8') as f:
    f.write(config_code)

path_code = """
const path = typeof window !== 'undefined' && window.require ? window.require('path') : require('path');
const isBrowser = typeof window !== 'undefined';

// Base root directory (src)
let baseDir = '';
if (isBrowser) {
    // In renderer, we assume relative to index.html which is in src/
    baseDir = __dirname || '.';
} else {
    baseDir = path.join(__dirname, '..');
}

function getAssetPath(subPath) {
    return path.join(baseDir, 'assets', subPath);
}

function getUtilsPath(subPath) {
    return path.join(baseDir, 'utils', subPath);
}

function getComponentsPath(subPath) {
    return path.join(baseDir, 'components', subPath);
}

module.exports = {
    getAssetPath,
    getUtilsPath,
    getComponentsPath,
    baseDir
};
"""

with open('src/utils/pathManager.js', 'w', encoding='utf-8') as f:
    f.write(path_code)
