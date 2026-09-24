const fs = require('fs');
const path = require('path');
const p = path.join('C:', 'Users', 'akula', 'Downloads', 'Hide-WIN', 'Hide-Win-Master', 'src', 'utils', 'window.js');
let text = fs.readFileSync(p, 'utf8');

text = text.replace(/contextIsolation: false,\s*\/\/ TODO: change to true/, "contextIsolation: false,\n            webviewTag: true,\n            // TODO: change to true");
text = text.replace(/contextIsolation: false,\n\s*backgroundThrottling: false,/g, "contextIsolation: false,\n            webviewTag: true,\n            backgroundThrottling: false,");

fs.writeFileSync(p, text, 'utf8');
console.log("Added webviewTag: true to window.js");
