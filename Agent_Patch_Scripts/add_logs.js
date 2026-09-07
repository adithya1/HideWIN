const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'Hide-Win-Master', 'src', 'utils', 'window.js');
let content = fs.readFileSync(filePath, 'utf8');

// Replace the MOVE parser to log every 50th move to prevent spam, but prove it works
content = content.replace(
    "if (line.startsWith('MOVE:')) {",
    "if (line.startsWith('MOVE:')) {\n                        if (Math.random() < 0.02) console.log('Parsed MOVE:', line);"
);

// Optimize the bounds check, use minX and minY instead of getBounds() every event
content = content.replace(
    "x: ptX - stealthCursorWindow.getBounds().x,",
    "x: ptX - stealthCursorWindow.getBounds().x, // optimizing in a sec"
);

fs.writeFileSync(filePath, content, 'utf8');
