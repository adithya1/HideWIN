import os
import re

history_path = r"C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\HistoryView.js"
with open(history_path, 'r', encoding='utf-8') as f:
    history = f.read()

# 1. Add viewMode state
if "this.viewMode = 'list';" not in history:
    history = history.replace(
        "this.searchQuery = '';",
        "this.searchQuery = '';\n        this.viewMode = 'list';"
    )
    
if "viewMode: { type: String }," not in history:
    history = history.replace(
        "searchQuery: { type: String },",
        "searchQuery: { type: String },\n            viewMode: { type: String },"
    )

# 2. Add styles
styles_to_inject = """
            .notes-toolbar { display: flex; align-items: center; justify-content: space-between; gap: var(--space-sm); background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); padding: var(--space-sm) var(--space-md); border-radius: 16px; border: 1px solid rgba(59, 130, 246, 0.2); box-shadow: 0 4px 24px -8px rgba(59, 130, 246, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.5); flex-wrap: wrap; color: #0f172a; margin-bottom: var(--space-md); }
            .search-box { display: flex; align-items: center; gap: 6px; background: #ffffff; border: 1px solid rgba(59, 130, 246, 0.3); box-shadow: inset 0 2px 4px rgba(59, 130, 246, 0.05); border-radius: 12px; padding: 4px 10px; min-width: 180px; transition: all 0.2s; height: 42px; box-sizing: border-box; flex: 1; }
            .search-box:focus-within { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2), inset 0 2px 4px rgba(59, 130, 246, 0.05); }
            .search-box input { background: transparent; border: none; color: #0f172a; width: 100%; font-size: var(--font-size-sm); outline: none; padding: 0; }
            .icon-btn { display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 10px; border: 1px solid transparent; background: transparent; color: #64748b; cursor: pointer; transition: all 0.2s; }
            .icon-btn:hover { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
            .icon-btn.active { background: #ffffff; border-color: rgba(59, 130, 246, 0.3); color: #3b82f6; box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1); }
            .icon-btn svg { width: 18px; height: 18px; }
            .notes-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: var(--space-md); }
            .grid-viewport { flex: 1; overflow-y: auto; padding-right: 4px; }
            
            .session-card.grid-mode { flex-direction: column; align-items: flex-start; }
"""

if ".notes-toolbar {" not in history:
    history = history.replace(
        "            .search-wrap {",
        styles_to_inject + "\n            .search-wrap {"
    )

# 3. Replace the header with the toolbar
header_html = """              <div class="notes-toolbar">
                  <div class="search-box">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                      <input class="search-input" type="text" placeholder="Search history..." .value=${this.searchQuery} @input=${this.handleSearchInput} />
                  </div>
                  <div style="display:flex;gap:4px;flex-shrink:0;">
                      <button class="icon-btn ${this.viewMode === 'list' ? 'active' : ''}" title="List view" @click=${() => this.viewMode = 'list'}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                      </button>
                      <button class="icon-btn ${this.viewMode === 'grid' ? 'active' : ''}" title="Grid view" @click=${() => this.viewMode = 'grid'}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect></svg>
                      </button>
                  </div>
              </div>"""

old_header = """              <div class="page-header-row">
                  <div class="page-title">History</div>
              </div>
  
              <div class="search-wrap" style="margin-bottom: var(--space-md);">
                  <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="11" cy="11" r="8"/>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                  <input
                      class="control"
                      type="text"
                      placeholder="Search past sessions..."
                      .value=${this.searchQuery}
                      @input=${this.handleSearchInput}
                  />
              </div>"""

history = history.replace(old_header, header_html)

# 4. Modify list rendering to check viewMode
list_render = """                      ${!this.loading ? html`<div class="${this.viewMode === 'grid' ? 'notes-grid' : 'sessions-list'}">` : ''}
                      ${!this.loading ? filteredSessions.map(session => html`
                          <div class="session-card ${this.viewMode === 'grid' ? 'grid-mode' : ''}" @click=${() => this.openSession(session.sessionId)}>
                              <div class="session-left">
                                  <span class="session-profile">${this._getProfileLabel(session)}</span>
                                  <span class="session-date">
                                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                      ${this.formatDate(session.createdAt)} • ${this.formatTime(session.createdAt)}
                                  </span>
                              </div>
                              ${session.messageCount > 0 ? html`<span class="session-badge">${session.messageCount} Messages</span>` : ''}
                          </div>
                      `) : ''}
                      ${!this.loading ? html`</div>` : ''}"""

old_list_render = """                      ${!this.loading ? filteredSessions.map(session => html`
                          <div class="session-card" @click=${() => this.openSession(session.sessionId)}>
                              <div class="session-left">
                                  <span class="session-profile">${this._getProfileLabel(session)}</span>
                                  <span class="session-date">
                                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                      ${this.formatDate(session.createdAt)} â€¢ ${this.formatTime(session.createdAt)}
                                  </span>
                              </div>
                              ${session.messageCount > 0 ? html`<span class="session-badge">${session.messageCount} Messages</span>` : ''}
                          </div>
                      `) : ''}"""

# handle '•' encoding issue in regex/replace
import re
history = re.sub(r"\$\{\!this\.loading \? filteredSessions\.map\(session => html`[\s\S]*?<\/div>\n                      `\) : ''\}", list_render, history)


with open(history_path, 'w', encoding='utf-8') as f:
    f.write(history)
print("History UI updated!")
