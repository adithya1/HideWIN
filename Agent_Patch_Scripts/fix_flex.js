const fs = require('fs');
const path = require('path');
const p = path.join('C:', 'Users', 'akula', 'Downloads', 'Hide-WIN', 'Hide-Win-Master', 'src', 'components', 'views', 'sharedPageStyles.js');
let text = fs.readFileSync(p, 'utf8');
text = text.replace('box-sizing: border-box; flex: 1;', 'box-sizing: border-box;');
fs.writeFileSync(p, text, 'utf8');
console.log("Removed flex: 1 from search-box");
