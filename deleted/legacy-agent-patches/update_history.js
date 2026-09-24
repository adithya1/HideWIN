const fs = require('fs');
const path = require('path');

const historyPath = path.join('C:', 'Users', 'akula', 'Downloads', 'Hide-WIN', 'Hide-Win-Master', 'src', 'components', 'views', 'HistoryView.js');
let history = fs.readFileSync(historyPath, 'utf8');

if (!history.includes("this.viewMode = 'list';")) {
    history = history.replace("this.searchQuery = '';", "this.searchQuery = '';\n        this.viewMode = 'list';");
}
if (!history.includes("viewMode: { type: String }")) {
    history = history.replace("searchQuery: { type: String },", "searchQuery: { type: String },\n            viewMode: { type: String },");
}

const stylesToInject = `
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
            .session-card.grid-mode { flex-direction: column; align-items: flex-start; }`;

if (!history.includes('.notes-toolbar { display: flex;')) {
    history = history.replace('.search-wrap {', stylesToInject + '\n            .search-wrap {');
}

const newHeader = "              <div class=\"notes-toolbar\">\n                  <div class=\"search-box\">\n                      <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><circle cx=\"11\" cy=\"11\" r=\"8\"></circle><line x1=\"21\" y1=\"21\" x2=\"16.65\" y2=\"16.65\"></line></svg>\n                      <input class=\"search-input\" type=\"text\" placeholder=\"Search history...\" .value=${this.searchQuery} @input=${this.handleSearchInput} />\n                  </div>\n                  <div style=\"display:flex;gap:4px;flex-shrink:0;\">\n                      <button class=\"icon-btn ${this.viewMode === 'list' ? 'active' : ''}\" title=\"List view\" @click=${() => this.viewMode = 'list'}>\n                          <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><line x1=\"3\" y1=\"6\" x2=\"21\" y2=\"6\"></line><line x1=\"3\" y1=\"12\" x2=\"21\" y2=\"12\"></line><line x1=\"3\" y1=\"18\" x2=\"21\" y2=\"18\"></line></svg>\n                      </button>\n                      <button class=\"icon-btn ${this.viewMode === 'grid' ? 'active' : ''}\" title=\"Grid view\" @click=${() => this.viewMode = 'grid'}>\n                          <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><rect x=\"3\" y=\"3\" width=\"7\" height=\"7\"></rect><rect x=\"14\" y=\"3\" width=\"7\" height=\"7\"></rect><rect x=\"3\" y=\"14\" width=\"7\" height=\"7\"></rect><rect x=\"14\" y=\"14\" width=\"7\" height=\"7\"></rect></svg>\n                      </button>\n                  </div>\n              </div>";

const oldHeaderRegex = /<div class="page-header-row">[\s\S]*?<\/div>\s*<div class="search-wrap"[\s\S]*?<\/div>/;
history = history.replace(oldHeaderRegex, newHeader);

const newList = "                      ${!this.loading ? html`<div class=\"${this.viewMode === 'grid' ? 'notes-grid' : 'sessions-list'}\">` : ''}\n                      ${!this.loading ? filteredSessions.map(session => html`\n                          <div class=\"session-card ${this.viewMode === 'grid' ? 'grid-mode' : ''}\" @click=${() => this.openSession(session.sessionId)}>\n                              <div class=\"session-left\">\n                                  <span class=\"session-profile\">${this._getProfileLabel(session)}</span>\n                                  <span class=\"session-date\">\n                                      <svg width=\"12\" height=\"12\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><rect x=\"3\" y=\"4\" width=\"18\" height=\"18\" rx=\"2\" ry=\"2\"></rect><line x1=\"16\" y1=\"2\" x2=\"16\" y2=\"6\"></line><line x1=\"8\" y1=\"2\" x2=\"8\" y2=\"6\"></line><line x1=\"3\" y1=\"10\" x2=\"21\" y2=\"10\"></line></svg>\n                                      ${this.formatDate(session.createdAt)} - ${this.formatTime(session.createdAt)}\n                                  </span>\n                              </div>\n                              ${session.messageCount > 0 ? html`<span class=\"session-badge\">${session.messageCount} Messages</span>` : ''}\n                          </div>\n                      `) : ''}\n                      ${!this.loading ? html`</div>` : ''}";

const listRegex = /\$\{\!this\.loading \? filteredSessions\.map\(session => html`[\s\S]*?<\/div>\s*`\) : ''\}/;
history = history.replace(listRegex, newList);

fs.writeFileSync(historyPath, history, 'utf8');
console.log("History UI updated!");
