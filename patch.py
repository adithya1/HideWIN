import os

filepath = r"Hide-Win-Master\src\utils\window.shortcuts.js"
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the require('electron') line to include screen
content = content.replace(
    "const { ipcMain, globalShortcut, BrowserWindow } = require('electron');",
    "const { ipcMain, globalShortcut, BrowserWindow, screen } = require('electron');"
)

# Insert the let isWindowIpcRegistered = false; after storage require
content = content.replace(
    "const storage = require('../storage');",
    "const storage = require('../storage');\n\nlet isWindowIpcRegistered = false;"
)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Patched!")
