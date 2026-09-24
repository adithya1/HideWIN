const fs = require('fs');
const path = require('path');
const p = path.join('C:', 'Users', 'akula', 'Downloads', 'Hide-WIN', 'Hide-Win-Master', 'src', 'components', 'views', 'AICustomizeView.js');
let text = fs.readFileSync(p, 'utf8');

const regex = /<\/div>\s*`;\s*\} else \{\s*return html`[\s\S]*?customElements\.define\('ai-customize-view', AICustomizeView\);/s;

const correctEnding = `            </div>
        \`;
    }
}

customElements.define('ai-customize-view', AICustomizeView);`;

text = text.replace(regex, correctEnding);
fs.writeFileSync(p, text, 'utf8');
console.log("Fixed the dangling syntax error in AICustomizeView.js FOR REAL!");
