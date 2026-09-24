const fs = require('fs');
const path = require('path');
const p = path.join('C:', 'Users', 'akula', 'Downloads', 'Hide-WIN', 'Hide-Win-Master', 'src', 'components', 'views', 'AICustomizeView.js');
let text = fs.readFileSync(p, 'utf8');

const newToolbar = `                <div class="notes-toolbar">
                    <div class="toolbar-actions">
                        <button class="notes-btn primary" @click=\${() => this.openCreateModal()}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                            New Profile
                        </button>
                    </div>

                    <div class="search-box">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <input
                            class="search-input"
                            type="text"
                            placeholder="Search profiles..."
                            .value=\${this.searchQuery}
                            @input=\${e => this.searchQuery = e.target.value}
                        />
                    </div>
                    
                    <div style="display:flex;gap:4px;flex-shrink:0;">
                        <button class="icon-btn \${this.viewMode === 'list' ? 'active' : ''}" title="List view" @click=\${() => this.viewMode = 'list'}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                        </button>
                        <button class="icon-btn \${this.viewMode === 'grid' ? 'active' : ''}" title="Grid view" @click=\${() => this.viewMode = 'grid'}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect></svg>
                        </button>
                    </div>
                </div>`;

const regex = /<div class="profiles-header-banner">[\s\S]*?<\/div>\s*<\/div>/;
if (regex.test(text)) {
    text = text.replace(regex, newToolbar);
    fs.writeFileSync(p, text, 'utf8');
    console.log("Fixed AICustomizeView.js Toolbar!");
} else {
    console.log("Could not find profiles-header-banner block.");
}
