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
    const configuredUrl = config.networkMode === 'cloud' ? config.webDomain : '';
    const envUrl = typeof process !== 'undefined' ? process.env.HIDEWIN_WEB_URL : '';
    return normalizeHttpUrl(configuredUrl || envUrl, 'HIDEWIN_WEB_URL');
}

function getApiBaseUrl() {
    const config = getConfig();
    const configuredUrl = config.networkMode === 'cloud' ? config.apiDomain : '';
    const envUrl = typeof process !== 'undefined' ? process.env.HIDEWIN_API_URL : '';
    return normalizeHttpUrl(configuredUrl || envUrl, 'HIDEWIN_API_URL');
}

function getWsBaseUrl() {
    const envUrl = typeof process !== 'undefined' ? process.env.HIDEWIN_WS_URL : '';
    const parsed = new URL(envUrl || getApiBaseUrl());
    if (!['ws:', 'wss:', 'http:', 'https:'].includes(parsed.protocol)) {
        throw new Error('HIDEWIN_WS_URL must use WS or WSS.');
    }
    if (parsed.protocol === 'http:') parsed.protocol = 'ws:';
    if (parsed.protocol === 'https:') parsed.protocol = 'wss:';
    return parsed.toString().replace(/\/+$/, '');
}

function normalizeHttpUrl(value, name) {
    if (typeof value !== 'string' || !value.trim()) {
        if (name === 'HIDEWIN_WEB_URL') return 'http://127.0.0.1:5173';
        if (name === 'HIDEWIN_API_URL') return 'http://127.0.0.1:8000';
        return '';
    }
    let endpoint = value.trim();
    if (!/^https?:\/\//i.test(endpoint)) endpoint = "https://" + endpoint;
    const parsed = new URL(endpoint);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
        throw new Error(name + ' must use HTTP or HTTPS.');
    }
    return parsed.toString().replace(/\/+$/, '');
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