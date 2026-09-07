const fs = require('fs');
const path = 'src/components/views/AICustomizeView.js';
let content = fs.readFileSync(path, 'utf8');

if (!content.includes('viewMode: { type: String }')) {
    content = content.replace('searchQuery: { type: String },', "searchQuery: { type: String },\n        viewMode: { type: String },");
    content = content.replace('this.searchQuery = \'\';', "this.searchQuery = '';\n        this.viewMode = 'list';");
    
    const renderListRowFn = `
    _selectProfile(id) {
        this.selectedProfile = id;
        if (this.onProfileChange) {
            this.onProfileChange(id);
        }
    }

    renderProfileListRow(profile) {
        const isActive = this.selectedProfile === profile.id;
        const iconColor = profile.type === 'job' ? '#10b981' : (profile.type === 'general' ? '#6366f1' : '#f59e0b');
        const bgColor = profile.type === 'job' ? 'rgba(16,185,129,0.1)' : (profile.type === 'general' ? 'rgba(99,102,241,0.1)' : 'rgba(245,158,11,0.1)');
        
        return html\`
            <div class="list-row \${isActive ? 'active' : ''}" @click=\${() => this._selectProfile(profile.id)}>
                <div class="list-row-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                </div>
                <span class="list-row-title">\${profile.userName || 'Unnamed Profile'}</span>
                
                <span class="list-row-type" style="background: \${bgColor}; color: \${iconColor};">\${profile.type || 'unknown'}</span>
                
                <div class="list-row-actions">
                    <button class="row-action-btn" title="Edit Profile" @click=\${(e) => { e.stopPropagation(); this._editProfile(profile.id); }}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                    \${!isActive ? html\`
                    <button class="row-action-btn delete" title="Delete Profile" @click=\${(e) => { e.stopPropagation(); this._deleteProfile(profile.id); }}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                    \` : ''}
                </div>
            </div>
        \`;
    }
`;
    content = content.replace('renderProfileCard(profile) {', renderListRowFn + '\n    renderProfileCard(profile) {');

    const cssAdd = `
            .icon-btn {
                display: inline-flex; align-items: center; justify-content: center;
                width: 32px; height: 32px;
                border-radius: var(--radius-md); border: 1px solid transparent;
                background: transparent; color: var(--text-secondary);
                cursor: pointer; transition: all var(--transition); flex-shrink: 0;
            }
            .icon-btn:hover { background: var(--bg-hover); color: var(--text-primary); }
            .icon-btn.active { background: var(--accent); border-color: var(--accent); color: white; }
            .icon-btn svg { width: 15px; height: 15px; }

            .notes-list { display: flex; flex-direction: column; gap: 2px; overflow-y: auto; flex: 1; padding-bottom: 20px; }
            .list-row { display: flex; align-items: center; gap: 10px; padding: 8px 12px; border-radius: var(--radius-md); border: 1px solid transparent; background: var(--bg-surface); cursor: pointer; transition: all 0.15s; min-height: 40px; }
            .list-row:hover { border-color: var(--border); background: var(--bg-elevated); }
            .list-row.active { border-color: #3b82f6; background: rgba(59, 130, 246, 0.05); }
            .list-row-icon { flex-shrink: 0; color: var(--text-tertiary); }
            .list-row-icon svg { width: 15px; height: 15px; }
            .list-row-title { flex: 1; font-size: 13px; font-weight: 500; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
            .list-row-type { font-size: 10px; font-weight: 600; padding: 2px 6px; border-radius: 10px; text-transform: uppercase; letter-spacing: 0.04em; flex-shrink: 0; }
            .list-row-actions { display: flex; gap: 4px; flex-shrink: 0; opacity: 0; transition: opacity 0.15s; }
            .list-row:hover .list-row-actions, .list-row.active .list-row-actions { opacity: 1; }
            .row-action-btn { display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 4px; border: none; background: transparent; color: var(--text-tertiary); cursor: pointer; transition: all 0.15s; padding: 0; }
            .row-action-btn:hover { background: var(--bg-hover); color: var(--text-primary); }
            .row-action-btn.delete:hover { color: #ef4444; background: rgba(239,68,68,0.08); }
            .row-action-btn svg { width: 13px; height: 13px; }
            `;
            
    content = content.replace('/* "?"? Grid Viewport "?"? */', cssAdd + '\n            /* "?"? Grid Viewport "?"? */');

    const replaceTopBar = `                        <div class="search-box">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            <input type="text" class="search-input" placeholder="Search profiles..." .value=\${this.searchQuery} @input=\${(e) => this.searchQuery = e.target.value}>
                        </div>
                        <div style="display: flex; gap: 4px;">
                            <button class="icon-btn \${this.viewMode === 'list' ? 'active' : ''}" title="List view" @click=\${() => this.viewMode = 'list'}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                            </button>
                            <button class="icon-btn \${this.viewMode === 'grid' ? 'active' : ''}" title="Grid view" @click=\${() => this.viewMode = 'grid'}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                            </button>
                        </div>
                        <button class="btn-create-big" @click=\${() => this._openModal()}>`;
                        
    content = content.replace(/<div class="search-box">[\s\S]*?<button class="btn-create-big" @click=\${\(\) => this._openModal\(\)}>/, replaceTopBar);

    const replaceGrid = `            <!-- "?"? Viewport "?"? -->
            <div class="grid-viewport">
                \${this.viewMode === 'list' ? html\`
                    <div class="notes-list">
                        \${filteredProfiles.length > 0 
                            ? filteredProfiles.map(p => this.renderProfileListRow(p))
                            : html\`
                                <div class="empty-state" style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: var(--text-muted); gap: 12px; margin-top: 40px;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                    <div>No profiles found</div>
                                </div>
                            \`}
                    </div>
                \` : html\`
                <div class="profiles-grid">
                    \${filteredProfiles.length > 0 
                        ? filteredProfiles.map(p => this.renderProfileCard(p))
                        : html\`
                            <div class="empty-state" style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: var(--text-muted); gap: 12px; grid-column: 1 / -1; margin-top: 40px;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                <div>No profiles found</div>
                            </div>
                        \`}
                </div>
                \`}
            </div>`;
    
    content = content.replace(/<!-- "\?"\? Grid Viewport "\?"\? -->[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/, replaceGrid + '\n        </div>\n    </div>');

    fs.writeFileSync(path, content);
    console.log('AICustomizeView.js updated');
} else {
    console.log('Already updated');
}
