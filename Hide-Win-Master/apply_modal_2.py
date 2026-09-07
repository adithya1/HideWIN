import re

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\MeetingDashboardView.js', 'r', encoding='utf-8') as f:
    content = f.read()

modal_html = """
                ${this.viewingMeeting ? html`
                    <div class="share-modal-overlay" @click=${(e) => { if(e.target === e.currentTarget) this.viewingMeeting = null; }}>
                        <div class="share-modal">
                            <div class="share-modal-header">
                                <h2 class="share-modal-title">Share Meeting</h2>
                                <button class="share-modal-close" @click=${() => this.viewingMeeting = null}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                </button>
                            </div>
                            <div class="share-modal-body">
                                <div class="share-info-block">
                                    <div class="share-info-row">
                                        <span class="share-info-label">Meeting Name</span>
                                        <span class="share-info-value" style="text-align: right; max-width: 60%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${this.viewingMeeting.title}</span>
                                    </div>
                                    <div class="share-info-row">
                                        <span class="share-info-label">Meeting ID</span>
                                        <span class="share-info-value">
                                            ${this.viewingMeeting.id}
                                            <button class="share-copy-btn" title="Copy ID" @click=${() => { navigator.clipboard.writeText(this.viewingMeeting.id); this.toastMessage = "Meeting ID Copied!"; this.toastType = "success"; }}>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                                            </button>
                                        </span>
                                    </div>
                                    <div class="share-info-row">
                                        <span class="share-info-label">Passcode</span>
                                        <span class="share-info-value">
                                            ${this.viewingMeeting.passcode || 'None'}
                                            ${this.viewingMeeting.passcode ? html`
                                            <button class="share-copy-btn" title="Copy Passcode" @click=${() => { navigator.clipboard.writeText(this.viewingMeeting.passcode); this.toastMessage = "Passcode Copied!"; this.toastType = "success"; }}>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                                            </button>
                                            ` : ''}
                                        </span>
                                    </div>
                                </div>
                                
                                <div class="share-apps-row">
                                    <button class="share-app-btn" @click=${() => this.handleSocialShare('copy', this.viewingMeeting)}>
                                        <div class="share-app-icon" style="background: #eef2ff; color: #4f46e5;">
                                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                                        </div>
                                        <span class="share-app-label">Copy Link</span>
                                    </button>
                                    <button class="share-app-btn" @click=${() => this.openGoogleCalendar(this.viewingMeeting)}>
                                        <div class="share-app-icon" style="background: #fff7ed; color: #ea580c;">
                                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                        </div>
                                        <span class="share-app-label">Calendar</span>
                                    </button>
                                    <button class="share-app-btn" @click=${() => this.handleSocialShare('whatsapp', this.viewingMeeting)}>
                                        <div class="share-app-icon" style="background: #f0fdf4; color: #16a34a;">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                        </div>
                                        <span class="share-app-label">WhatsApp</span>
                                    </button>
                                </div>
                                
                                <button class="share-join-btn" @click=${() => { this.startMeeting(this.viewingMeeting); this.viewingMeeting = null; }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                                    Join Meeting Now
                                </button>
                            </div>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
"""

target = """            </div>
        `;

    }"""
    
content = content.replace(target, modal_html + "\n            </div>\n        `;\n\n    }")

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\MeetingDashboardView.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Injected HTML successfully!")
