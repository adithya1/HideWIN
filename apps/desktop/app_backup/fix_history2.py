import os
import re

path = 'src/components/views/HistoryView.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

if 'viewMode: { type: String }' not in content:
    content = content.replace('loading: { type: Boolean },', "loading: { type: Boolean },\n        viewMode: { type: String },")
    content = content.replace('this.loading = true;', "this.loading = true;\n        this.viewMode = 'list';")

    css_add = """
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
            
            .grid-viewport { flex: 1; overflow-y: auto; padding-right: 4px; margin-top: 10px; }
            .profiles-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: var(--space-md); padding-bottom: 20px; }
    """
    content = content.replace('.sessions-list {', css_add + '\n            .sessions-list {')

    render_row = """
    renderSessionListRow(session) {
        const timeAgo = this.formatTimestamp(session.startTime);
        return html`
            <div class="list-row" @click=${() => this.openSession(session.sessionId)}>
                <div class="list-row-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                </div>
                <span class="list-row-title">${this._getProfileLabel(session)}</span>
                <span style="font-size: 12px; color: var(--text-tertiary); flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${session.context?.mode || 'Chat'}</span>
                <span class="list-row-type" style="background: rgba(99,102,241,0.1); color: #6366f1;">${session.interactionCount || 0} msgs</span>
                <span style="font-size: 11px; color: var(--text-tertiary); flex-shrink: 0; text-align: right; min-width: 120px;">${timeAgo}</span>
            </div>
        `;
    }
"""
    content = content.replace('renderListView() {', render_row + '\n    renderListView() {')

    search_wrap = """<div class="search-wrap" style="margin-bottom: var(--space-md); display: flex; gap: 8px;">
                <div style="position: relative; flex: 1; display: flex; align-items: center;">
                    <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="position: absolute; left: 12px; width: 14px; height: 14px; color: var(--text-tertiary);">
                        <circle cx="11" cy="11" r="8"/>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                    <input
                        class="control"
                        type="text"
                        placeholder="Search past sessions..."
                        .value=${this.searchQuery}
                        @input=${this.handleSearchInput}
                        style="width: 100%; padding-left: 36px; padding-right: 12px; height: 38px; border: 1px solid var(--border); border-radius: 8px; background: var(--bg-surface); color: var(--text-primary); font-size: 14px;"
                    />
                </div>
                <div style="display: flex; gap: 4px;">
                    <button class="icon-btn ${this.viewMode === 'list' ? 'active' : ''}" title="List view" @click=${() => this.viewMode = 'list'}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                    </button>
                    <button class="icon-btn ${this.viewMode === 'grid' ? 'active' : ''}" title="Grid view" @click=${() => this.viewMode = 'grid'}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                    </button>
                </div>
            </div>"""

    old_html_regex = r'<div class="search-wrap".*?</section>'
    new_html = search_wrap + """
            <section class="list-shell grid-viewport">
                ${this.viewMode === 'list' ? html`
                    <div class="notes-list">
                        ${this.loading ? html`<div class="empty">Loading...</div>` : ''}
                        ${!this.loading && filteredSessions.length === 0 ? html`<div class="empty">No matching sessions found.</div>` : ''}
                        ${!this.loading ? filteredSessions.map(session => this.renderSessionListRow(session)) : ''}
                    </div>
                ` : html`
                    <div class="profiles-grid">
                        ${this.loading ? html`<div class="empty">Loading...</div>` : ''}
                        ${!this.loading && filteredSessions.length === 0 ? html`<div class="empty">No matching sessions found.</div>` : ''}
                        ${!this.loading ? filteredSessions.map(session => html`
                            <div class="session-card" @click=${() => this.openSession(session.sessionId)}>
                                <div class="session-left">
                                    <span class="session-profile">${this._getProfileLabel(session)}</span>
                                    <span class="session-mode">${session.context?.mode || 'Chat'}</span>
                                    <span class="session-time">${this.formatTimestamp(session.startTime)}</span>
                                </div>
                                <div class="session-right">
                                    <span class="session-stat">${session.interactionCount || 0} msgs</span>
                                </div>
                            </div>
                        `) : ''}
                    </div>
                `}
            </section>"""
    
    content = re.sub(old_html_regex, new_html, content, flags=re.DOTALL)

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("HistoryView.js updated")
else:
    print("Already updated")
