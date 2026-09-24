const fs = require('fs');
const path = require('path');
const p = path.join('C:', 'Users', 'akula', 'Downloads', 'Hide-WIN', 'Hide-Win-Master', 'src', 'components', 'views', 'AICustomizeView.js');
let text = fs.readFileSync(p, 'utf8');

text = text.replace(
    `<button class="start-btn" style="width:auto; padding:8px 16px;" @click=\${this.createNewProfile}>`,
    `<button class="notes-btn primary" @click=\${this.createNewProfile}>`
);
text = text.replace(
    `style="width:16px;height:16px;margin-right:6px;vertical-align:-3px;"`,
    ``
);
fs.writeFileSync(p, text, 'utf8');
console.log("Updated AICustomizeView.js buttons!");
