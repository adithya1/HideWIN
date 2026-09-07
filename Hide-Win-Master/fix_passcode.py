with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\MeetingDashboardView.js', 'r', encoding='utf-8') as f:
    content = f.read()

target = """                                        <span class="share-info-value">
                                            ${this.viewingMeeting.passcode || 'None'}
                                            ${this.viewingMeeting.passcode ? html`
                                            <button class="share-copy-btn" title="Copy Passcode" @click=${() => { navigator.clipboard.writeText(this.viewingMeeting.passcode); this.toastMessage = "Passcode Copied!"; this.toastType = "success"; }}>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                                            </button>
                                            ` : ''}
                                        </span>"""

replacement = """                                        <span class="share-info-value">
                                            ${(() => {
                                                const pc = this.viewingMeeting.recurrence && this.viewingMeeting.recurrence !== 'none' ? this.viewingMeeting.recurrence : (this.viewingMeeting.id ? this.viewingMeeting.id.split('-').pop().toLowerCase() : '');
                                                return html`
                                                    ${pc || 'None'}
                                                    ${pc ? html`
                                                    <button class="share-copy-btn" title="Copy Passcode" @click=${() => { navigator.clipboard.writeText(pc); this.toastMessage = "Passcode Copied!"; this.toastType = "success"; }}>
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                                                    </button>
                                                    ` : ''}
                                                `;
                                            })()}
                                        </span>"""

if target in content:
    content = content.replace(target, replacement)
    with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\MeetingDashboardView.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Replaced successfully")
else:
    print("Target not found. Please double check the exact string.")
