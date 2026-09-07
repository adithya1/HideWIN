const fs = require('fs');
const path = require('path');
const p = path.join('C:', 'Users', 'akula', 'Downloads', 'Hide-WIN', 'Hide-Win-Master', 'src', 'components', 'views', 'AICustomizeView.js');
let text = fs.readFileSync(p, 'utf8');

const regex = /<\/div>\s*<div class="doc-labels">[\s\S]*?<!-- Popup Focus Modal -->/s;
if (regex.test(text)) {
    text = text.replace(regex, "\n                <!-- Popup Focus Modal -->");
    fs.writeFileSync(p, text, 'utf8');
    console.log("Fixed AICustomizeView.js AGAIN!");
} else {
    console.log("Could not find the dangling block.");
}
