const fs = require('fs');
const path = require('path');
const p = path.join('C:', 'Users', 'akula', 'Downloads', 'Hide-WIN', 'Hide-Win-Master', 'src', 'components', 'views', 'HistoryView.js');

let text = fs.readFileSync(p, 'utf8');
text = text.replace('<div class="unified-page">\r\n                <div class="unified-wrap">', '<div class="notes-container">');
text = text.replace('<div class="unified-page">\n                <div class="unified-wrap">', '<div class="notes-container">');
text = text.replace('</div>\r\n            </div>\r\n        `;\r\n    }', '</div>\r\n        `;\r\n    }');
text = text.replace('</div>\n            </div>\n        `;\n    }', '</div>\n        `;\n    }');
fs.writeFileSync(p, text, 'utf8');
console.log("Replaced HistoryView.js container with notes-container!");
