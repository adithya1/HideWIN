const fs = require('fs');
const path = require('path');

const notesPath = path.join('C:', 'Users', 'akula', 'Downloads', 'Hide-WIN', 'Hide-Win-Master', 'src', 'components', 'views', 'NotesView.js');
const sharedPath = path.join('C:', 'Users', 'akula', 'Downloads', 'Hide-WIN', 'Hide-Win-Master', 'src', 'components', 'views', 'sharedPageStyles.js');
const histPath = path.join('C:', 'Users', 'akula', 'Downloads', 'Hide-WIN', 'Hide-Win-Master', 'src', 'components', 'views', 'HistoryView.js');
const profPath = path.join('C:', 'Users', 'akula', 'Downloads', 'Hide-WIN', 'Hide-Win-Master', 'src', 'components', 'views', 'AICustomizeView.js');

let notesCss = fs.readFileSync(notesPath, 'utf8');

// We just copy the exact CSS block for lists and grids into sharedPageStyles
let shared = fs.readFileSync(sharedPath, 'utf8');
const stylesToInject = `
    /* EXACT NOTES LIST/GRID UI FOR 100% CONSISTENCY */
    .note-card { display: flex; flex-direction: column; background: rgba(38, 40, 48, 0.4); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 16px; padding: 16px; gap: 8px; position: relative; cursor: default; transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1); min-height: 150px; max-height: 260px; overflow: hidden; box-shadow: 0 4px 24px -8px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.05); }
    .note-card:hover { transform: translateY(-2px); box-shadow: 0 8px 32px -8px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.12); }
    .card-header { display: flex; align-items: center; justify-content: space-between; gap: 6px; }
    .card-title { font-size: 13px; font-weight: 600; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex: 1; }
    .card-type-badge { font-size: 10px; font-weight: 600; padding: 2px 6px; border-radius: 4px; text-transform: uppercase; background: rgba(99, 102, 241, 0.15); color: var(--accent); }
    .card-content { flex: 1; font-size: 12px; color: var(--text-secondary); line-height: 1.5; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; margin-top: 4px; }
    .card-footer { display: flex; align-items: center; justify-content: space-between; margin-top: auto; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.05); }
    .card-date { font-size: 10px; color: var(--text-muted); }
    .card-actions { display: flex; gap: 4px; }
    .action-btn { background: transparent; border: none; padding: 4px; color: var(--text-muted); cursor: pointer; border-radius: 6px; transition: all 0.2s; display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; }
    .action-btn:hover { background: rgba(255,255,255,0.1); color: var(--text-primary); }
    .action-btn.delete:hover { background: rgba(239, 68, 68, 0.2); color: #f87171; }
    .action-btn svg { width: 14px; height: 14px; }

    .list-row { display: flex; align-items: center; gap: 10px; padding: 8px 12px; border-radius: var(--radius-md); border: 1px solid transparent; background: var(--bg-surface); cursor: pointer; transition: all 0.15s; min-height: 40px; }
    .list-row:hover { background: rgba(255, 255, 255, 0.05); border-color: rgba(255,255,255,0.1); }
    .list-row-icon { display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 8px; background: rgba(255,255,255,0.05); color: var(--text-muted); }
    .list-row-icon svg { width: 14px; height: 14px; }
    .list-row-title { font-size: 13px; font-weight: 500; color: var(--text-primary); min-width: 120px; max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .list-row-preview { flex: 1; font-size: 12px; color: var(--text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .list-row-type { font-size: 10px; font-weight: 600; padding: 2px 6px; border-radius: 4px; text-transform: uppercase; background: rgba(99, 102, 241, 0.15); color: var(--accent); min-width: 60px; text-align: center; }
    .list-row-date { font-size: 11px; color: var(--text-muted); min-width: 80px; text-align: right; }
    .list-row-actions { display: flex; gap: 4px; opacity: 0; transition: opacity 0.2s; }
    .list-row:hover .list-row-actions { opacity: 1; }
    .row-action-btn { background: transparent; border: none; padding: 4px; color: var(--text-muted); cursor: pointer; border-radius: 6px; transition: all 0.2s; }
    .row-action-btn:hover { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
    .row-action-btn.delete:hover { background: rgba(239, 68, 68, 0.2); color: #f87171; }
    .row-action-btn svg { width: 14px; height: 14px; }
`;

if (!shared.includes('.note-card { display: flex; flex-direction: column;')) {
    shared = shared + "\n" + stylesToInject;
    fs.writeFileSync(sharedPath, shared, 'utf8');
}

// -----------------------------
// Now replace HistoryView.js list/grid rendering
// -----------------------------
let hist = fs.readFileSync(histPath, 'utf8');

const newHistList = `                      \${!this.loading ? html\`
                          <div class="\${this.viewMode === 'grid' ? 'notes-grid' : 'notes-list'}">
                              \${filteredSessions.map(session => this.viewMode === 'list' ? html\`
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
                              \` : html\`
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
                          </div>\` : ''}`;

const histRegex = /\$\{\!this\.loading \? html`\s*<div class="\$\{this\.viewMode === 'grid' \? 'notes-grid' : 'sessions-list'\}.*?<\/div>` : ''\}/s;
if (histRegex.test(hist)) {
    hist = hist.replace(histRegex, newHistList);
    fs.writeFileSync(histPath, hist, 'utf8');
    console.log("Updated History View styles!");
}

// -----------------------------
// Now replace AICustomizeView.js list/grid rendering
// -----------------------------
let prof = fs.readFileSync(profPath, 'utf8');

const newProfList = `                <div class="grid-viewport">
                    <div class="\${this.viewMode === 'grid' ? 'notes-grid' : 'notes-list'}">
                        \${filtered.map(p => {
                            const cardLabels = this.getDocLabelsForType(p.type || 'Job Interview');
                            
                            if (this.viewMode === 'list') {
                                return html\`
                                    <div class="list-row" @click=\${() => this.editProfile(p)}>
                                        <div class="list-row-icon">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                        </div>
                                        <span class="list-row-title">\${p.userName || p.name || 'Unnamed Profile'}</span>
                                        <span class="list-row-preview">\${p.customPrompt ? p.customPrompt.substring(0,40) + '...' : ''}</span>
                                        <span class="list-row-type">\${p.type || 'Profile'}</span>
                                        <div class="list-row-actions">
                                            <button class="row-action-btn delete" @click=\${(e) => this.deleteProfile(e, p.id)} title="Delete Profile">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                            </button>
                                        </div>
                                    </div>
                                \`;
                            } else {
                                return html\`
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
                                                <button class="action-btn delete" @click=\${(e) => this.deleteProfile(e, p.id)} title="Delete Profile">
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                \`;
                            }
                        })}
                    </div>
                </div>`;

const profRegex = /<div class="grid-viewport">[\s\S]*?<\/div>\s*<\/div>/;
if (profRegex.test(prof)) {
    prof = prof.replace(profRegex, newProfList);
    fs.writeFileSync(profPath, prof, 'utf8');
    console.log("Updated Profile View styles!");
}
