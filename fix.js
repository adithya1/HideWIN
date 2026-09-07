const fs = require('fs');
const p = 'c:/Users/akula/Downloads/Hide-WIN/Hide-Win-Master/src/utils/window.js';
const lines = fs.readFileSync(p, 'utf8').split('\n');
lines[277] = "        toggleVisibility: isMac ? 'Cmd+\\\\' : 'Ctrl+\\\\',";
fs.writeFileSync(p, lines.join('\n'), 'utf8');
