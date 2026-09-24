import os
import re

p = r"C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\InviteView.js"
with open(p, "r", encoding="utf-8") as f:
    text = f.read()

# 1. Replace the word "Token" with "Passcode" in the UI
text = text.replace("Token:", "Passcode:")

# 2. Update the copyInviteLink method to generate the auto-fill link and use a toast instead of alert
old_copy_start = "copyInviteLink() {"
old_copy_regex = r"copyInviteLink\(\)\s*\{[\s\S]*?alert\('Invite link and credentials copied to clipboard!'\);\s*\}"

new_copy_logic = """copyInviteLink() {
        if (!this.hostToken) {
            this.showToast('Error: Not connected to Signaling Server! Please try creating the channel again.', 'error');
            return;
        }
        const host = this.dnsDomain ? this.dnsDomain : `${this.dnsIP}:${this.dnsPort}`;
        const protocol = this.dnsDomain ? 'https' : 'http';
        
        // Auto-fill link with query params
        const fullLink = `${protocol}://${host}/invite/index.html?channel=${this.activeChannelId}&passcode=${this.hostToken}`;
        
        const creds = `Channel ID: ${this.activeChannelId}\\nPasscode: ${this.hostToken}`;
        const text = `Join my session:\\n${fullLink}\\n\\nOr enter manually:\\n${creds}`;
        
        if (window.require) {
            const { clipboard } = window.require('electron');
            clipboard.writeText(text);
        } else {
            navigator.clipboard.writeText(text);
        }
        
        this.showToast('Link and Passcode copied to clipboard!', 'success');
    }

    showToast(message, type = 'success') {
        this.toastMessage = message;
        this.toastType = type;
        this.requestUpdate();
        
        setTimeout(() => {
            this.toastMessage = '';
            this.requestUpdate();
        }, 3000);
    }
"""

text = re.sub(old_copy_regex, new_copy_logic, text)

# 3. Add toast properties and HTML
if "toastMessage: { type: String }" not in text:
    text = text.replace("dnsPort: { type: String }", "dnsPort: { type: String },\n        toastMessage: { type: String },\n        toastType: { type: String }")

toast_html = """
            ${this.toastMessage ? html`
                <div class="toast-notification ${this.toastType}">
                    ${this.toastType === 'success' ? '?' : '?'} ${this.toastMessage}
                </div>
            ` : ''}
            <div class="invite-container">
"""
if "toast-notification" not in text:
    text = text.replace('<div class="invite-container">', toast_html)

# Add toast CSS
toast_css = """
            .toast-notification {
                position: fixed;
                bottom: 24px;
                right: 24px;
                padding: 12px 24px;
                border-radius: 8px;
                color: white;
                font-weight: 600;
                font-size: 14px;
                z-index: 9999;
                box-shadow: 0 10px 25px rgba(0,0,0,0.3);
                animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            }
            .toast-notification.success {
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                border: 1px solid #34d399;
            }
            .toast-notification.error {
                background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
                border: 1px solid #f87171;
            }
            @keyframes slideIn {
                from { transform: translateY(100px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            .invite-container {
"""
if ".toast-notification {" not in text:
    text = text.replace(".invite-container {", toast_css)

with open(p, "w", encoding="utf-8") as f:
    f.write(text)
print("Updated InviteView.js with new link format, Passcode terminology, and Toast UI!")
