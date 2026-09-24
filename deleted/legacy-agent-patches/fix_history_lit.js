const fs = require('fs');
const path = require('path');

const historyPath = path.join('C:', 'Users', 'akula', 'Downloads', 'Hide-WIN', 'Hide-Win-Master', 'src', 'components', 'views', 'HistoryView.js');
let history = fs.readFileSync(historyPath, 'utf8');

// Fix the unclosed HTML tags inside Lit string template!
const brokenStr = "                                          ${!this.loading ? html`<div class=\"${this.viewMode === 'grid' ? 'notes-grid' : 'sessions-list'}\">` : ''}\r\n                      ${!this.loading ? filteredSessions.map(session => html`\r\n                          <div class=\"session-card ${this.viewMode === 'grid' ? 'grid-mode' : ''}\" @click=${() => this.openSession(session.sessionId)}>\r\n                              <div class=\"session-left\">\r\n                                  <span class=\"session-profile\">${this._getProfileLabel(session)}</span>\r\n                                  <span class=\"session-date\">\r\n                                      <svg width=\"12\" height=\"12\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><rect x=\"3\" y=\"4\" width=\"18\" height=\"18\" rx=\"2\" ry=\"2\"></rect><line x1=\"16\" y1=\"2\" x2=\"16\" y2=\"6\"></line><line x1=\"8\" y1=\"2\" x2=\"8\" y2=\"6\"></line><line x1=\"3\" y1=\"10\" x2=\"21\" y2=\"10\"></line></svg>\r\n                                      ${this.formatDate(session.createdAt)} - ${this.formatTime(session.createdAt)}\r\n                                  </span>\r\n                              </div>\r\n                              ${session.messageCount > 0 ? html`<span class=\"session-badge\">${session.messageCount} Messages</span>` : ''}\r\n                          </div>\r\n                      `) : ''}\r\n                      ${!this.loading ? html`</div>` : ''}";

const fixedStr = `                      \${!this.loading ? html\`
                          <div class="\${this.viewMode === 'grid' ? 'notes-grid' : 'sessions-list'}">
                              \${filteredSessions.map(session => html\`
                                  <div class="session-card \${this.viewMode === 'grid' ? 'grid-mode' : ''}" @click=\${() => this.openSession(session.sessionId)}>
                                      <div class="session-left">
                                          <span class="session-profile">\${this._getProfileLabel(session)}</span>
                                          <span class="session-date">
                                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                              \${this.formatDate(session.createdAt)} - \${this.formatTime(session.createdAt)}
                                          </span>
                                      </div>
                                      \${session.messageCount > 0 ? html\`<span class="session-badge">\${session.messageCount} Messages</span>\` : ''}
                                  </div>
                              \`)}
                          </div>\` : ''}`;

if (history.includes(brokenStr)) {
    history = history.replace(brokenStr, fixedStr);
    fs.writeFileSync(historyPath, history, 'utf8');
    console.log("Fixed Lit HTML unclosed tag syntax error!");
} else {
    // If exact string doesn't match due to newline differences, use a regex
    const regex = /\$\{\!this\.loading \? html`<div class="[^"]*">` : ''\}[\s\S]*?\$\{\!this\.loading \? html`<\/div>` : ''\}/;
    if (regex.test(history)) {
        history = history.replace(regex, fixedStr);
        fs.writeFileSync(historyPath, history, 'utf8');
        console.log("Fixed Lit HTML via regex fallback!");
    } else {
        console.log("Could not find the broken block!");
    }
}
