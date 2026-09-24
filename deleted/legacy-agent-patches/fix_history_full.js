const fs = require('fs');
const path = require('path');
const p = path.join('C:', 'Users', 'akula', 'Downloads', 'Hide-WIN', 'Hide-Win-Master', 'src', 'components', 'views', 'HistoryView.js');

const newRenderListView = `    renderListView() {
        const filteredSessions = this.getFilteredSessions();
        return html\`
            <div class="notes-toolbar">
                <div class="toolbar-actions">
                    <button class="notes-btn primary" @click=\${() => this.clearHistory && this.clearHistory()}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        Clear History
                    </button>
                </div>
                <div class="search-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    <input class="search-input" type="text" placeholder="Search history..." .value=\${this.searchQuery} @input=\${this.handleSearchInput} />
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

            \${this.loading ? html\`<div class="empty">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.5; margin-bottom: 8px; animation: spin 1s linear infinite;"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
                Loading sessions...
            </div>\` : ''}
            \${!this.loading && filteredSessions.length === 0 ? html\`<div class="empty">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.5; margin-bottom: 8px;"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                No matching sessions found.
            </div>\` : ''}

            \${(!this.loading && filteredSessions.length > 0) ? (this.viewMode === 'list' ? html\`
                <div class="notes-list">
                    \${filteredSessions.map(session => html\`
                        <div class="list-row" @click=\${() => this.openSession(session.sessionId)}>
                            <div class="list-row-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                            </div>
                            <span class="list-row-title">\${this._getProfileLabel(session)}</span>
                            <span class="list-row-preview">\${session.messageCount || 0} Messages</span>
                            <span class="list-row-type">SESSION</span>
                            <span class="list-row-date">\${this.formatDate(session.createdAt)}</span>
                            <div class="list-row-actions">
                                <button class="row-action-btn" title="Open" @click=\${() => this.openSession(session.sessionId)}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                                </button>
                            </div>
                        </div>
                    \`)}
                </div>
            \` : html\`
                <div class="grid-viewport">
                    <div class="notes-grid">
                        \${filteredSessions.map(session => html\`
                            <div class="note-card" @click=\${() => this.openSession(session.sessionId)} style="cursor: pointer;">
                                <div class="card-header">
                                    <span class="card-title">\${this._getProfileLabel(session)}</span>
                                    <span class="card-type-badge">SESSION</span>
                                </div>
                                <div class="card-content">
                                    \${session.messageCount || 0} Messages
                                </div>
                                <div class="card-footer">
                                    <span class="card-date">\${this.formatDate(session.createdAt)} - \${this.formatTime(session.createdAt)}</span>
                                    <div class="card-actions">
                                        <button class="action-btn" title="Open" @click=\${() => this.openSession(session.sessionId)}>
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        \`)}
                    </div>
                </div>
            \`) : ''}
        \`;
    }`;

let text = fs.readFileSync(p, 'utf8');
const regex = /renderListView\(\)\s*\{[\s\S]*?\}\s*renderDetailView/s;
text = text.replace(regex, newRenderListView + "\n\n    renderDetailView");
fs.writeFileSync(p, text, 'utf8');
console.log("Rewrote HistoryView.js renderListView!");
