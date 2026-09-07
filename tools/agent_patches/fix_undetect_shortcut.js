const fs = require('fs');
const path = require('path');
const p = path.join('C:', 'Users', 'akula', 'Downloads', 'Hide-WIN', 'Hide-Win-Master', 'src', 'utils', 'window.js');
let text = fs.readFileSync(p, 'utf8');

const regex = /globalShortcut\.register\(keybinds\.setMouseUndetectable,\s*\(\)\s*=>\s*\{\s*if\s*\(!mouseEventsIgnored\)\s*\{\s*mouseEventsIgnored = true;\s*mainWindow\.setIgnoreMouseEvents\(true,\s*\{\s*forward:\s*true\s*\}\);\s*console\.log\('Mouse events ignored via Ctrl\+S'\);\s*mainWindow\.webContents\.send\('click-through-toggled',\s*true\);\s*\}\s*\}\);/s;

const newHandler = `globalShortcut.register(keybinds.setMouseUndetectable, () => {
                if (!mouseEventsIgnored) {
                    mouseEventsIgnored = true;
                    mainWindow.setIgnoreMouseEvents(true, { forward: true });
                    console.log('Mouse events ignored via Ctrl+S');
                    mainWindow.webContents.send('click-through-toggled', true);
                    
                    if (typeof stealthActive !== 'undefined' && stealthActive) {
                        stealthActive = false;
                        stopStealthMode();
                        mainWindow.webContents.send('toggle-mouse-visibility');
                    }
                }
            });`;

if (regex.test(text)) {
    text = text.replace(regex, newHandler);
    fs.writeFileSync(p, text, 'utf8');
    console.log("Updated setMouseUndetectable shortcut handler!");
} else {
    console.log("Regex didn't match.");
}
