const fs = require('fs');
const content = fs.readFileSync('C:\\Users\\akula\\Downloads\\Hide-WIN\\Hide-Win-Master\\src\\components\\views\\InviteView.js', 'utf8');
const methods = content.match(/[a-zA-Z0-9_]+\s*\([^)]*\)\s*\{/g);
console.log(methods.join('\n'));
