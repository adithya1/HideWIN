import re

with open('src/components/views/MainView.js', 'r', encoding='utf-8') as f:
    code = f.read()

# The bad string starts at "                <div class="home-subtext" style="margin-top: 24px;">"
# and ends right before "                </div>\n            </div>\n        `;\n    }\n\n    // -- Settings Render --"
# Let's just find _renderActionBar and cut out the bad part.

bad_history = '''
                <div class="home-subtext" style="margin-top: 24px;">
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
                </div>
'''

# The first one is inside _renderActionBar, the second one is inside render()
# I will just do code.replace(bad_history, "", 1) to remove the FIRST occurrence!
code = code.replace(bad_history, "", 1)

with open('src/components/views/MainView.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("Removed first occurrence of bad history!")
