const fs = require('fs');
const p = 'c:/Users/akula/Downloads/Hide-WIN/Hide-Win-Master/src/index.html';
let c = fs.readFileSync(p, 'utf8');
const lines = c.split('\n');
const fixed = lines.filter(l => !l.includes('GLOBAL ERROR'));
fs.writeFileSync(p, fixed.join('\n'), 'utf8');
