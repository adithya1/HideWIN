const fs = require('fs');
const path = require('path');
const p = path.join('C:', 'Users', 'akula', 'Downloads', 'Hide-WIN', 'Hide-Win-Master', 'src', 'components', 'views', 'AICustomizeView.js');

const newRender = `        return html\`
            <div class="profiles-container">
                <div class="notes-toolbar">
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
                </div>

                \${this.viewMode === 'list' ? html\`
                    <div class="notes-list">
                        \${filtered.map(p => html\`
                            <div class="list-row" @click=\${() => this.editProfile(p)}>
                                <div class="list-row-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                </div>
                                <span class="list-row-title">\${p.userName || p.name || 'Unnamed Profile'}</span>
                                <span class="list-row-preview">\${p.customPrompt ? p.customPrompt.substring(0,40) + '...' : ''}</span>
                                <span class="list-row-type">\${p.type || 'Profile'}</span>
                                <div class="list-row-actions">
                                    <button class="row-action-btn delete" @click=\${(e) => { e.stopPropagation(); this.deleteProfile(e, p.id); }} title="Delete Profile">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                    </button>
                                </div>
                            </div>
                        \`)}
                    </div>
                \` : html\`
                    <div class="grid-viewport">
                        <div class="notes-grid">
                            \${filtered.map(p => html\`
                                <div class="note-card" @click=\${() => this.editProfile(p)} style="cursor:pointer;">
                                    <div class="card-header">
                                        <span class="card-title">\${p.userName || p.name || 'Unnamed Profile'}</span>
                                        <span class="card-type-badge">\${p.type || 'Profile'}</span>
                                    </div>
                                    <div class="card-content">
                                        \${p.customPrompt ? p.customPrompt.substring(0,100) + '...' : 'No prompt...'}
                                    </div>
                                    <div class="card-footer">
                                        <span class="card-date"></span>
                                        <div class="card-actions">
                                            <button class="action-btn delete" @click=\${(e) => { e.stopPropagation(); this.deleteProfile(e, p.id); }} title="Delete Profile">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            \`)}
                        </div>
                    </div>
                \`}

                <!-- Popup Focus Modal -->
                \${this.renderModal()}
            </div>
        \`;`;

let text = fs.readFileSync(p, 'utf8');
const regex = /return html\`\s*<div class="profiles-container">[\s\S]*?<\/div>\s*`;/s;
text = text.replace(regex, newRender);
fs.writeFileSync(p, text, 'utf8');
console.log("Rewrote AICustomizeView.js render!");
