# IPC COMMUNICATION CONTRACTS

## Principle
The Renderer process must NEVER execute arbitrary Node.js code or shell commands. All communication occurs over explicitly named Inter-Process Communication (IPC) channels.

## Preload API (`window.api`)
```javascript
// Example Preload Implementation
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    // Renderer -> Main (One-way)
    setGlobalShortcut: (shortcut) => ipcRenderer.send('set-shortcut', shortcut),
    
    // Renderer -> Main -> Renderer (Two-way)
    getMicrophones: () => ipcRenderer.invoke('get-microphones'),
    
    // Main -> Renderer (Event Listener)
    onMeetingInvite: (callback) => ipcRenderer.on('meeting-invite', (_event, data) => callback(data))
});
```

## IPC Validation Rule
The Main process MUST validate and sanitize ALL arguments received via `ipcMain.on` or `ipcMain.handle`. Never pass raw Renderer strings into `exec()`, `spawn()`, or native file system paths without sanitization.
