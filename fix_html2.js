const fs = require('fs');
const p = 'c:/Users/akula/Downloads/Hide-WIN/Hide-Win-Master/src/index.html';
let c = fs.readFileSync(p, 'utf8');
if (!c.includes('<head>')) {
    c = c.replace('<html>', '<html>\n    <head>');
    fs.writeFileSync(p, c, 'utf8');
}
