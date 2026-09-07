const fs = require('fs');
let main = fs.readFileSync('src/components/views/MainView.js', 'utf8');

const danglingRegex = /\\s*\\ : Object\\.keys\\(groupedSessions\\)\\.map\\(group => html\\[\\s\\S]*?\\\\)\\}[\\s\\S]*?\\\\)\\}\\s*<\\/div>/;

main = main.replace(danglingRegex, '');
fs.writeFileSync('src/components/views/MainView.js', main);
console.log('Fixed syntax error in MainView.js');
