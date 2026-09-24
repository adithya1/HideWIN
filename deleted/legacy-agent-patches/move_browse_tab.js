const fs = require('fs');
const path = require('path');
const p = path.join('C:', 'Users', 'akula', 'Downloads', 'Hide-WIN', 'Hide-Win-Master', 'src', 'components', 'app', 'HideWinApp.js');
let text = fs.readFileSync(p, 'utf8');

const browseStr = "{ id: 'browse', label: 'Browse', icon: html`<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"12\" cy=\"12\" r=\"10\"></circle><line x1=\"2\" y1=\"12\" x2=\"22\" y2=\"12\"></line><path d=\"M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z\"></path></svg>` },\n            ";

text = text.replace(browseStr, ""); // remove it from before history

const historyRegex = /(\{\s*id:\s*'history'[\s\S]*?\},)/;
text = text.replace(historyRegex, "$1\n            " + browseStr.trim());

fs.writeFileSync(p, text, 'utf8');
console.log("Moved Browse after History!");
