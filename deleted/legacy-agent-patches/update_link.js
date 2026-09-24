const fs = require('fs');
const path = 'C:\\Users\\akula\\Downloads\\Hide-WIN\\Hide-Win-Master\\src\\components\\views\\InviteView.js';
let content = fs.readFileSync(path, 'utf8');

content = content.replace("const cloudHost = '127.0.0.1:9000';", "const cloudHost = 'hidewin.local:9000';");

fs.writeFileSync(path, content);
console.log("Updated invite link to use hidewin.local");
