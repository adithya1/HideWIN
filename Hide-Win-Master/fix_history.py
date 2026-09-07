import re

with open('src/components/views/MainView.js', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Remove history HTML
history_html = '''                <div class="home-subtext" style="margin-top: 24px;">
                    View and manage your previous sessions below.
                </div>

                <div class="history-list-container">
                    ${Object.keys(groupedSessions).length === 0 ? html`
                        <div style="color: var(--text-muted); padding-top: 40px; text-align: center;">No sessions found. Start a new session above!</div>
                    ` : Object.keys(groupedSessions).map(group => html`
                        <div class="history-group">
                            <div class="history-group-title">${group}</div>
                            ${groupedSessions[group].map(session => html`
                                <div class="history-row" @click=${() => this.onNavigate('history')}>
                                    <div class="history-title">${session.title || 'Untitled Session'}</div>
                                    <div class="history-time">${this._formatTime(session.updatedAt || session.createdAt)}</div>
                                </div>
                            `)}
                        </div>
                    `)}
                </div>'''

if history_html in code:
    code = code.replace(history_html, "")
    print("Removed history HTML")
else:
    print("Could not find history HTML string")

# 2. Remove groupedSessions logic
grouped_sessions_logic = '''        const groupedSessions = {};
        if (this._sessions && this._sessions.length > 0) {
            this._sessions.forEach(session => {
                const group = this._formatDateGroup(session.updatedAt || session.createdAt);
                if (!groupedSessions[group]) groupedSessions[group] = [];
                groupedSessions[group].push(session);
            });
        }'''

if grouped_sessions_logic in code:
    code = code.replace(grouped_sessions_logic, "")
    print("Removed groupedSessions logic")
else:
    print("Could not find groupedSessions logic string")

with open('src/components/views/MainView.js', 'w', encoding='utf-8') as f:
    f.write(code)
