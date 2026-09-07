import re

css = """
            .card-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 6px;
            }

            .card-title {
                font-size: 13px;
                font-weight: 600;
                color: var(--text-primary);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                flex: 1;
            }

            .card-type-badge {
                font-size: 10px;
                font-weight: 600;
                padding: 2px 6px;
                border-radius: 4px;
                text-transform: uppercase;
                background: rgba(99, 102, 241, 0.15);
                color: var(--accent);
                border: 1px solid rgba(99, 102, 241, 0.2);
            }

            .card-content {
                font-size: 12px;
                line-height: 1.5;
                color: var(--text-secondary);
                overflow: hidden;
                display: -webkit-box;
                -webkit-line-clamp: 4;
                -webkit-box-orient: vertical;
                word-break: break-word;
                flex: 1;
            }

            .card-footer {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-top: auto;
                padding-top: 6px;
                border-top: 1px solid var(--border);
            }

            .card-date {
                font-size: 10px;
                color: var(--text-muted);
            }

            .card-actions {
                display: flex;
                align-items: center;
                gap: 6px;
            }
"""

def inject_grid_css(path, hook):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    classes_to_remove = ['.card-header', '.card-title', '.card-type-badge', '.card-content', '.card-footer', '.card-date', '.card-actions']
    for cls in classes_to_remove:
        content = re.sub(r'\\' + cls + r'\s*\{.*?\}', '', content, flags=re.DOTALL)
        
    content = content.replace(hook, css + "\n" + hook)
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

inject_grid_css('src/components/views/HistoryView.js', '.unified-wrap {')
inject_grid_css('src/components/views/AICustomizeView.js', '.profiles-container {')

# Rewrite Profile grid HTML
with open('src/components/views/AICustomizeView.js', 'r', encoding='utf-8') as f:
    ai_content = f.read()

new_profile_html = """
                                      <div
                                          class="profile-card ${this.selectedProfile === p.id ? 'active' : ''}"
                                          @click=${() => this.openEditModal(p)}
                                      >
                                          <div class="card-header">
                                              <span class="card-title">${p.userName || p.name || 'User'}</span>
                                              <span class="card-type-badge">ID #${p.numericId || ''}</span>
                                          </div>
                                          <div class="card-content">
                                              <strong style="display:block;margin-bottom:4px;color:var(--text-primary);">${p.type || 'Job Interview'}</strong>
                                              ${p.resumeFileName ? p.resumeFileName : (p.resumeContent || p.customPrompt || 'Default experience active')}
                                          </div>
                                          <div class="card-footer">
                                              <span class="card-date">${p.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'New'}</span>
                                              <div class="card-actions">
                                                  <button class="action-btn-small edit" @click=${(e) => { e.stopPropagation(); this.openEditModal(p); }} style="padding: 2px 6px; font-size: 10px;">Edit</button>
                                              </div>
                                          </div>
                                      </div>
"""
ai_content = re.sub(r'<div\s+class="profile-card.*?</div>\s*</div>\s*</div>\s*</div>', new_profile_html.strip(), ai_content, flags=re.DOTALL)
with open('src/components/views/AICustomizeView.js', 'w', encoding='utf-8') as f:
    f.write(ai_content)


# Rewrite History grid HTML
with open('src/components/views/HistoryView.js', 'r', encoding='utf-8') as f:
    hist_content = f.read()

new_hist_html = """
                              <div class="session-card" @click=${() => this.openSession(session.sessionId)}>
                                  <div class="card-header">
                                      <span class="card-title">${this._getProfileLabel(session)}</span>
                                      <span class="card-type-badge">${session.context?.mode || 'Chat'}</span>
                                  </div>
                                  <div class="card-content">
                                      <strong style="display:block;margin-bottom:4px;color:var(--text-primary);">${session.interactionCount || 0} Interactions</strong>
                                      Session containing history data...
                                  </div>
                                  <div class="card-footer">
                                      <span class="card-date">${this.formatTimestamp(session.startTime)}</span>
                                  </div>
                              </div>
"""
hist_content = re.sub(r'<div class="session-card".*?</div>\s*</div>\s*</div>', new_hist_html.strip(), hist_content, flags=re.DOTALL)
with open('src/components/views/HistoryView.js', 'w', encoding='utf-8') as f:
    f.write(hist_content)

print("Grid HTML and CSS completely rewritten.")
