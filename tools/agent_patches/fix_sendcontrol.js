const fs = require('fs');
const path = 'C:\\Users\\akula\\Downloads\\Hide-WIN - Copy\\hidewin-fastapi\\invite_client\\index.html';
let content = fs.readFileSync(path, 'utf8');

content = content.replace('if (e instanceof MouseEvent) {', 'if (e.clientX !== undefined) {');
fs.writeFileSync(path, content);
console.log("Fixed sendControlEvent");
