import re

path = 'src/components/views/HistoryView.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add padding and gap to .unified-page
content = re.sub(
    r'\.unified-page {\s*overflow-y: hidden;\s*display: flex;\s*flex-direction: column;\s*height: 100%;\s*}',
    r'.unified-page {\n                overflow-y: hidden;\n                display: flex;\n                flex-direction: column;\n                height: 100%;\n                padding: var(--space-md);\n                gap: var(--space-md);\n            }',
    content
)

# 2. Add list-row-actions to list-row in renderSessionListRow
list_row_replacement = """
                <span class="list-row-type" style="background: transparent; color: var(--accent);">${session.interactionCount || 0} msgs</span>
                <span style="font-size: 11px; color: var(--text-tertiary); flex-shrink: 0; text-align: right; min-width: 120px;">${timeAgo}</span>
                <div class="list-row-actions">
                    <button class="row-action-btn delete" title="Delete Session" @click=${(e) => this.deleteSession(session.sessionId, e)}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                </div>
"""
content = re.sub(
    r'<span class="list-row-type"[^>]*>\$\{session\.interactionCount \|\| 0\} msgs</span>\s*<span[^>]*>\$\{timeAgo\}</span>',
    list_row_replacement.strip(),
    content
)

# 3. Add list-row-actions to session-card in renderListView
card_replacement = """
                                <div class="session-right">
                                    <span class="session-stat">${session.interactionCount || 0} msgs</span>
                                    <button class="action-btn-small delete" title="Delete Session" @click=${(e) => this.deleteSession(session.sessionId, e)} style="margin-left: 8px; background: transparent; border: none; color: var(--danger); cursor: pointer; padding: 4px;">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2 2v2"></path></svg>
                                    </button>
                                </div>
"""
content = re.sub(
    r'<div class="session-right">\s*<span class="session-stat">\$\{session\.interactionCount \|\| 0\} msgs</span>\s*</div>',
    card_replacement.strip(),
    content
)

# 4. In case unified-wrap also needs gap? Wait, unified-wrap has notes-toolbar and list-shell.
# Let's add gap to unified-wrap.
content = re.sub(
    r'\.unified-wrap {\s*height: 100%;\s*display: flex;\s*flex-direction: column;\s*}',
    r'.unified-wrap {\n                height: 100%;\n                display: flex;\n                flex-direction: column;\n                gap: var(--space-md);\n            }',
    content
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed HistoryView margins and delete buttons")
