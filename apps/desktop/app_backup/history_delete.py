import re

css_to_add = """
            .notes-btn.danger {
                background: var(--bg-surface);
                border: 1px solid rgba(239, 68, 68, 0.3);
                color: #ef4444;
            }
            .notes-btn.danger:hover {
                background: rgba(239, 68, 68, 0.05);
                border-color: #ef4444;
                box-shadow: 0 4px 12px rgba(239, 68, 68, 0.1);
            }

            .list-row-actions {
                display: flex;
                align-items: center;
                gap: 4px;
                opacity: 0;
                transition: opacity 0.2s;
            }
            .list-row:hover .list-row-actions { opacity: 1; }
            .row-action-btn {
                display: inline-flex; align-items: center; justify-content: center;
                width: 24px; height: 24px;
                border-radius: 4px; border: none;
                background: transparent; color: var(--text-tertiary);
                cursor: pointer; transition: all 0.15s;
                padding: 0;
            }
            .row-action-btn:hover { background: var(--bg-hover); color: var(--text-primary); }
            .row-action-btn.delete:hover { color: #ef4444; background: rgba(239,68,68,0.08); }
            .row-action-btn svg { width: 13px; height: 13px; }

            .action-btn {
                background: transparent;
                border: none;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 26px; height: 26px;
                border-radius: 6px;
                color: var(--text-tertiary);
                cursor: pointer;
                transition: all 0.15s;
            }
            .action-btn:hover { background: var(--bg-hover); color: var(--text-primary); }
            .action-btn.delete:hover { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
            .action-btn svg { width: 14px; height: 14px; }
"""

path = 'src/components/views/HistoryView.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add CSS
content = content.replace('.unified-wrap {', css_to_add + '\n            .unified-wrap {')

# Add JS Methods
js_methods = """
    async deleteSession(sessionId, e) {
        if (e) e.stopPropagation();
        if (confirm('Are you sure you want to delete this session?')) {
            await hideWin.storage.deleteSession(sessionId);
            await this.loadSessions();
        }
    }

    async deleteAllSessions(e) {
        if (e) e.stopPropagation();
        if (confirm('Are you sure you want to delete all history? This cannot be undone.')) {
            await hideWin.storage.deleteAllSessions();
            await this.loadSessions();
        }
    }
"""
content = content.replace('async loadSessions() {', js_methods + '\n    async loadSessions() {')

# Toolbar Delete All Button
toolbar_replacement = """
                  <div class="toolbar-actions">
                      <div class="page-title" style="margin-right: 16px;">History</div>
                      <button class="notes-btn danger" @click=${this.deleteAllSessions}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <polyline points="3 6 5 6 21 6"></polyline>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                          Delete All
                      </button>
                  </div>
"""
content = re.sub(r'<div class="toolbar-actions">\s*<div class="page-title" style="margin-right: 16px;">History</div>\s*</div>', toolbar_replacement.strip(), content)

# List view Delete Button
list_btn = """
                                  <div class="list-row-actions">
                                      <button class="row-action-btn delete" title="Delete" @click=${e => this.deleteSession(session.sessionId, e)}>
                                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                      </button>
                                  </div>
                              </div>
"""
content = re.sub(r'<span class="list-row-date">\${this\.formatTimestamp\(session\.startTime\)}</span>\s*</div>', '<span class="list-row-date">${this.formatTimestamp(session.startTime)}</span>\n' + list_btn, content)

# Grid view Delete Button
grid_btn = """
                                      <div class="card-actions">
                                          <button class="action-btn delete" title="Delete" @click=${e => this.deleteSession(session.sessionId, e)}>
                                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                          </button>
                                      </div>
                                  </div>
                              </div>
"""
content = re.sub(r'<span class="card-date">\${this\.formatTimestamp\(session\.startTime\)}</span>\s*</div>\s*</div>', '<span class="card-date">${this.formatTimestamp(session.startTime)}</span>\n' + grid_btn, content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("History updated with delete logic and icons!")
