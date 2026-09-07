const fs = require('fs');
const p = 'c:/Users/akula/Downloads/Hide-WIN/Hide-Win-Master/src/components/app/HideWinApp.js';
let c = fs.readFileSync(p, 'utf8');
c = c.replace(/\\n            <div class="app-shell"/g, '\n            <div class="app-shell"');
fs.writeFileSync(p, c, 'utf8');
console.log('Done!');
