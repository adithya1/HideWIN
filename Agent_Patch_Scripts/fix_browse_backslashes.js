const fs = require('fs');
const path = require('path');
const p = path.join('C:', 'Users', 'akula', 'Downloads', 'Hide-WIN', 'Hide-Win-Master', 'src', 'components', 'views', 'BrowseView.js');
let text = fs.readFileSync(p, 'utf8');
text = text.replace(/\\\$/g, '$'); // Replace \$ with $
text = text.replace(/\\\`/g, '`'); // Replace \` with `
fs.writeFileSync(p, text, 'utf8');
console.log("Fixed backslashes in BrowseView.js");
