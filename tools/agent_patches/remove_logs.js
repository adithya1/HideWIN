const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'Hide-Win-Master', 'src', 'utils', 'window.js');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace("if (line.startsWith('MOVE:')) {\n                        if (Math.random() < 0.02) console.log('Parsed MOVE:', line);", "if (line.startsWith('MOVE:')) {");

fs.writeFileSync(filePath, content, 'utf8');
