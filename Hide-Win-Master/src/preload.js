const { contextBridge, ipcRenderer } = require('electron');
const configManager = require('./utils/configManager');

const allowedChannels = new Set([
    'get-preferences', 'storage:get-api-key', 'storage:get-groq-api-key',
    'storage:get-credentials', 'storage:get-preferences', 'storage:set-api-key',
    'storage:set-groq-api-key', 'storage:set-credentials', 'storage:update-preference',
    'storage:clear-all', 'open-external', 'storage:get-all-sessions',
    'storage:set-config', 'storage:get-config'
]);

contextBridge.exposeInMainWorld('adminBridge', {
    invoke(channel, ...args) {
        if (!allowedChannels.has(channel)) {
            return Promise.reject(new Error('This admin action is not available.'));
        }
        return ipcRenderer.invoke(channel, ...args);
    },
    getApiBaseUrl: () => configManager.getApiBaseUrl(),
    getWebBaseUrl: () => configManager.getWebBaseUrl()
});
