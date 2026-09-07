import re

# 1. Update index.js
with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\index.js', 'r', encoding='utf-8') as f:
    content = f.read()

social_share_handler = """    ipcMain.on('social-share', async (event, { platform, text }) => {
        try {
            const encodedText = encodeURIComponent(text);
            let url = '';
            if (platform === 'whatsapp') url = `https://wa.me/?text=${encodedText}`;
            else if (platform === 'gmail') url = `https://mail.google.com/mail/?view=cm&fs=1&body=${encodedText}`;
            else if (platform === 'outlook') url = `https://outlook.live.com/mail/0/deeplink/compose?body=${encodedText}`;
            
            if (url) {
                const { shell } = require('electron');
                await shell.openExternal(url);
            }
        } catch (err) {
            console.error('Failed to handle social share:', err);
        }
    });
"""

if "ipcMain.on('social-share'" not in content:
    content = content.replace("ipcMain.handle('open-external', async (event, url) => {", social_share_handler + "\n    ipcMain.handle('open-external', async (event, url) => {")

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\index.js', 'w', encoding='utf-8') as f:
    f.write(content)

# 2. Update MeetingDashboardView.js
with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\MeetingDashboardView.js', 'r', encoding='utf-8') as f:
    dashboard = f.read()

gmail_outlook_buttons = """                                    <button class="share-app-btn" @click=${() => this.handleSocialShare('gmail', this.viewingMeeting)}>
                                        <div class="share-app-icon" style="background: #fef2f2; color: #dc2626;">
                                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                                        </div>
                                        <span class="share-app-label">Gmail</span>
                                    </button>
                                    <button class="share-app-btn" @click=${() => this.handleSocialShare('outlook', this.viewingMeeting)}>
                                        <div class="share-app-icon" style="background: #eff6ff; color: #2563eb;">
                                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                                        </div>
                                        <span class="share-app-label">Outlook</span>
                                    </button>"""

if 'gmail' not in dashboard:
    target = """<button class="share-app-btn" @click=${() => this.handleSocialShare('whatsapp', this.viewingMeeting)}>"""
    dashboard = dashboard.replace(target, gmail_outlook_buttons + '\n                                    ' + target)

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\MeetingDashboardView.js', 'w', encoding='utf-8') as f:
    f.write(dashboard)

print("Done")
