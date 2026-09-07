const fs = require('fs');
const path = require('path');
const p = path.join('C:', 'Users', 'akula', 'Downloads', 'Hide-WIN', 'Hide-Win-Master', 'src', 'utils', 'window.js');
let text = fs.readFileSync(p, 'utf8');

const regex = /else \{\s*mouseEventsIgnored = true;\s*win\.setIgnoreMouseEvents\(true, \{ forward: true \}\);\s*console\.log\('Mouse events ignored \(from UI\)'\);\s*\}/s;

const newElse = `else {
            mouseEventsIgnored = true;
            win.setIgnoreMouseEvents(true, { forward: true });
            console.log('Mouse events ignored (from UI)');
            
            // If the user clicks the UI switch to "Undetectable", we MUST also turn off Stealth Mode
            // so they can use their OS cursor to click through!
            if (typeof stealthActive !== 'undefined' && stealthActive) {
                stealthActive = false;
                stopStealthMode();
                win.webContents.send('toggle-mouse-visibility');
                console.log('Stealth mode forcefully turned OFF because app went Undetectable');
            }
        }`;

if (regex.test(text)) {
    text = text.replace(regex, newElse);
    fs.writeFileSync(p, text, 'utf8');
    console.log("Updated toggle-click-through to disable stealth mode on Undetect!");
} else {
    console.log("Regex didn't match.");
}
