const fs = require('fs');
const path = require('path');
const p = path.join('C:', 'Users', 'akula', 'Downloads', 'Hide-WIN', 'Hide-Win-Master', 'src', 'components', 'views', 'AICustomizeView.js');
let text = fs.readFileSync(p, 'utf8');
text = text.replace('<div style="display:flex; gap:8px;">', '<div class="toolbar-actions">');
fs.writeFileSync(p, text, 'utf8');
console.log("Fixed AICustomizeView.js toolbar-actions wrapper!");
