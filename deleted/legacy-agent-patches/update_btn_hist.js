const fs = require('fs');
const path = require('path');
const p = path.join('C:', 'Users', 'akula', 'Downloads', 'Hide-WIN', 'Hide-Win-Master', 'src', 'components', 'views', 'HistoryView.js');
let text = fs.readFileSync(p, 'utf8');

const oldHeader = `<div class="search-box">`;
const newHeader = `<div class="toolbar-actions">\n                      <button class="notes-btn primary" @click=\${() => this.clearHistory && this.clearHistory()}>\n                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>\n                          Clear History\n                      </button>\n                  </div>\n                  <div class="search-box">`;

if (!text.includes('Clear History')) {
    text = text.replace(oldHeader, newHeader);
    fs.writeFileSync(p, text, 'utf8');
    console.log("Updated HistoryView.js buttons!");
}
