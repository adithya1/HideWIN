import re

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\MeetingDashboardView.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Add viewingMeeting to properties
if 'viewingMeeting: { type: Object }' not in content:
    content = re.sub(r'(viewMode:\s*\{\s*type:\s*String\s*\},)', r'\1\n        viewingMeeting: { type: Object },', content)

# Initialize it
if 'this.viewingMeeting = null;' not in content:
    content = re.sub(r'(this\.viewMode\s*=\s*.*?;\n)', r'\1        this.viewingMeeting = null;\n', content)

# Replace startMeeting with viewingMeeting in the card clicks
content = content.replace(
    'this.startMeeting(m); }} style="cursor: pointer;"',
    'this.viewingMeeting = m; }} style="cursor: pointer;"'
)

# Modal CSS
modal_css = """
            .share-modal-overlay {
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.4);
                backdrop-filter: blur(4px);
                -webkit-backdrop-filter: blur(4px);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: fadeIn 0.2s ease;
            }
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            
            .share-modal {
                background: #ffffff;
                width: 90%;
                max-width: 420px;
                border-radius: 24px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.15);
                display: flex;
                flex-direction: column;
                overflow: hidden;
                animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            }
            .share-modal-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 20px 24px;
                border-bottom: 1px solid #f3f4f6;
            }
            .share-modal-title {
                font-size: 18px;
                font-weight: 700;
                color: #111827;
                margin: 0;
            }
            .share-modal-close {
                background: transparent;
                border: none;
                cursor: pointer;
                color: #6b7280;
                padding: 4px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background 0.2s;
            }
            .share-modal-close:hover {
                background: #f3f4f6;
                color: #111827;
            }
            .share-modal-body {
                padding: 24px;
                display: flex;
                flex-direction: column;
                gap: 24px;
            }
            .share-info-block {
                display: flex;
                flex-direction: column;
                gap: 16px;
                background: #f9fafb;
                padding: 16px;
                border-radius: 16px;
                border: 1px solid #f3f4f6;
            }
            .share-info-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .share-info-label {
                font-size: 13px;
                color: #6b7280;
                font-weight: 500;
            }
            .share-info-value {
                font-size: 15px;
                color: #111827;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .share-copy-btn {
                background: transparent;
                border: none;
                color: #4f46e5;
                cursor: pointer;
                padding: 4px;
                border-radius: 4px;
            }
            .share-copy-btn:hover {
                background: #e0e7ff;
            }
            
            .share-apps-row {
                display: flex;
                align-items: flex-start;
                gap: 20px;
                overflow-x: auto;
                padding-bottom: 8px;
                scrollbar-width: none;
            }
            .share-apps-row::-webkit-scrollbar { display: none; }
            .share-app-btn {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 8px;
                background: transparent;
                border: none;
                cursor: pointer;
                min-width: 60px;
                padding: 0;
            }
            .share-app-icon {
                width: 52px;
                height: 52px;
                border-radius: 50%;
                background: #f3f4f6;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #111827;
                transition: transform 0.2s, background 0.2s;
            }
            .share-app-btn:hover .share-app-icon {
                transform: scale(1.05);
                background: #e5e7eb;
            }
            .share-app-label {
                font-size: 12px;
                color: #4b5563;
                font-weight: 500;
            }
            .share-join-btn {
                background: #4f46e5;
                color: white;
                border: none;
                padding: 16px;
                border-radius: 16px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: background 0.2s, transform 0.1s;
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }
            .share-join-btn:hover {
                background: #4338ca;
            }
            .share-join-btn:active {
                transform: scale(0.98);
            }
"""

if '.share-modal-overlay {' not in content:
    content = content.replace('/* Minimal overrides to reuse unified styles for Meetings */', '/* Minimal overrides to reuse unified styles for Meetings */\n' + modal_css)

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

if 'share-modal-overlay' not in content:
    # Append right before the very last </div>
    # Using regex to find the closing div of the main render block
    content = re.sub(r'(\s*)(</div>\s*`;\s*})$', r'\1' + modal_html + r'\2', content)

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\MeetingDashboardView.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Applied modal UI")
