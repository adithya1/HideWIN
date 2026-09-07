import re

path = r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\index.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

injection = r'''
const fs = require('fs');
const path = require('path');
const logFile = path.join(__dirname, '..', 'app_debug.log');
function writeLog(msg) {
    fs.appendFileSync(logFile, new Date().toISOString() + ' - ' + msg + '\n');
}

process.on('uncaughtException', (error) => {
    writeLog('MAIN UNCAUGHT: ' + error.stack);
});
process.on('unhandledRejection', (reason) => {
    writeLog('MAIN UNHANDLED: ' + reason);
});

app.on('web-contents-created', (event, contents) => {
    contents.on('console-message', (event, level, message, line, sourceId) => {
        writeLog(`[RENDERER CONSOLE] ${message} (line ${line} in ${sourceId})`);
    });
    contents.on('plugin-crashed', (e) => writeLog('PLUGIN CRASHED'));
    contents.on('render-process-gone', (e, details) => writeLog('RENDERER GONE: ' + JSON.stringify(details)));
});
'''

if 'app_debug.log' not in content:
    content = content.replace("const { app, BrowserWindow, ipcMain, desktopCapturer, shell } = require('electron');", "const { app, BrowserWindow, ipcMain, desktopCapturer, shell } = require('electron');\n" + injection)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
