import os
import re

file_path = r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\MeetingDashboardView.js'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add activeTab property
content = content.replace("viewMode: { type: String }", "viewMode: { type: String },\n        activeTab: { type: String }")
content = content.replace("this.viewMode = 'grid';", "this.viewMode = 'grid';\n        this.activeTab = 'active';")

# Fetch logic update
fetch_logic = """
    async fetchMeetings() {
        this.isLoading = true;
        try {
            const { ipcRenderer } = window.require('electron');
            const tokenResponse = await ipcRenderer.invoke('storage:get-credentials');
            let token = "";
            if (tokenResponse) {
                const creds = JSON.parse(tokenResponse);
                token = creds.jwtToken || "";
            }

            const prefsStr = await ipcRenderer.invoke('storage:get-preferences');
            let dnsIP = '127.0.0.1'; let dnsPort = '8000';
            if(prefsStr) {
                 let prefs = typeof prefsStr === 'string' ? JSON.parse(prefsStr) : prefsStr;
                 if (prefs && prefs.data) prefs = prefs.data;
                 if (prefs.dnsIP) dnsIP = prefs.dnsIP;
            }
            const cloudHost = dnsIP.includes('.loca.lt') ? dnsIP : `${dnsIP}:${dnsPort}`;
            const protocol = dnsIP.includes('.loca.lt') ? 'https' : 'http';
            
            const url = this.activeTab === 'active' ? `${protocol}://${cloudHost}/api/meetings/upcoming` : `${protocol}://${cloudHost}/api/meetings/history`;
            this.apiUrl = url;

            const res = await fetch(this.apiUrl, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                this.meetings = await res.json();
            }
        } catch(err) {
            console.error(err);
        } finally {
            this.isLoading = false;
        }
    }
    
    async deleteMeeting(id) {
        if (!confirm("Are you sure you want to delete this meeting?")) return;
        try {
            const { ipcRenderer } = window.require('electron');
            const tokenResponse = await ipcRenderer.invoke('storage:get-credentials');
            let token = JSON.parse(tokenResponse).jwtToken || "";
            
            const prefsStr = await ipcRenderer.invoke('storage:get-preferences');
            let dnsIP = '127.0.0.1'; let dnsPort = '8000';
            if(prefsStr) {
                 let prefs = typeof prefsStr === 'string' ? JSON.parse(prefsStr) : prefsStr;
                 if (prefs && prefs.data) prefs = prefs.data;
                 if (prefs.dnsIP) dnsIP = prefs.dnsIP;
            }
            const protocol = dnsIP.includes('.loca.lt') ? 'https' : 'http';
            const cloudHost = dnsIP.includes('.loca.lt') ? dnsIP : `${dnsIP}:${dnsPort}`;
            
            const res = await fetch(`${protocol}://${cloudHost}/api/meetings/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                this.toastMessage = "Meeting deleted";
                this.toastType = "success";
                this.fetchMeetings();
            }
        } catch(e) { console.error(e); }
    }
    
    async clearAllHistory() {
        if (!confirm("Are you sure you want to clear ALL meeting history?")) return;
        try {
            const { ipcRenderer } = window.require('electron');
            const tokenResponse = await ipcRenderer.invoke('storage:get-credentials');
            let token = JSON.parse(tokenResponse).jwtToken || "";
            
            const prefsStr = await ipcRenderer.invoke('storage:get-preferences');
            let dnsIP = '127.0.0.1'; let dnsPort = '8000';
            if(prefsStr) {
                 let prefs = typeof prefsStr === 'string' ? JSON.parse(prefsStr) : prefsStr;
                 if (prefs && prefs.data) prefs = prefs.data;
                 if (prefs.dnsIP) dnsIP = prefs.dnsIP;
            }
            const protocol = dnsIP.includes('.loca.lt') ? 'https' : 'http';
            const cloudHost = dnsIP.includes('.loca.lt') ? dnsIP : `${dnsIP}:${dnsPort}`;
            
            const res = await fetch(`${protocol}://${cloudHost}/api/meetings/clear-all`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                this.toastMessage = "History cleared";
                this.toastType = "success";
                this.fetchMeetings();
            }
        } catch(e) { console.error(e); }
    }
    
    editMeeting(meeting) {
        this.dispatchEvent(new CustomEvent('edit-meeting', { 
            detail: meeting,
            bubbles: true, 
            composed: true 
        }));
    }
    
    async getInviteLink(meeting) {
        const { ipcRenderer } = window.require('electron');
        const prefsStr = await ipcRenderer.invoke('storage:get-preferences');
        let dnsIP = '127.0.0.1'; let dnsPort = '8000';
        if(prefsStr) {
             let prefs = typeof prefsStr === 'string' ? JSON.parse(prefsStr) : prefsStr;
                 if (prefs && prefs.data) prefs = prefs.data;
             if (prefs.dnsIP) dnsIP = prefs.dnsIP;
        }
        const cloudHost = dnsIP.includes('.loca.lt') ? dnsIP : `${dnsIP}:${dnsPort}`;
        const protocol = dnsIP.includes('.loca.lt') ? 'https' : 'http';
        const passcode = meeting.recurrence && meeting.recurrence !== 'none' ? meeting.recurrence : meeting.id.split('-').pop().toLowerCase();
        return `${protocol}://${cloudHost}/invite/index.html?channel=${meeting.id}&passcode=${passcode}`;
    }

    async handleSocialShare(platform, meeting) {
        const inviteLink = await this.getInviteLink(meeting);
        const { ipcRenderer } = window.require('electron');
        
        let shareText = `Join my meeting: ${meeting.title}\n\nLink: ${inviteLink}`;
        
        if (platform === 'copy') {
            navigator.clipboard.writeText(shareText);
            this.toastMessage = "Copied to clipboard!";
            this.toastType = "success";
            this.requestUpdate();
            setTimeout(() => { this.toastMessage = null; this.requestUpdate(); }, 3000);
            return;
        }
        
        ipcRenderer.send('social-share', { platform, text: shareText });
    }
"""

# We need to replace fetchMeetings and add the new methods
# Regex replace the fetchMeetings block
pattern = r"async fetchMeetings\(\) \{[\s\S]*?\} catch\(err\) \{[\s\S]*?\} finally \{[\s\S]*?\}\s*\}"
content = re.sub(pattern, fetch_logic.strip(), content)

# Now inject UI HTML changes
html_replace_start = """<div class="page-header-row">"""
html_replace_end = """<div class="grid-view">"""

new_header = """
                    <div class="page-header-row" style="margin-bottom: 24px; display: flex; flex-direction: column; gap: 16px;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <h2 class="page-title">Meeting Dashboard</h2>
                            <button class="notes-btn primary" @click=${() => this.dispatchEvent(new CustomEvent('new-meeting', { bubbles: true, composed: true }))} style="padding: 8px 16px; border-radius: 8px;">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18" style="margin-right:8px"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                New Meeting
                            </button>
                        </div>
                        
                        <div style="display: flex; gap: 16px; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px;">
                            <button @click=${() => { this.activeTab = 'active'; this.fetchMeetings(); }} style="background: none; border: none; font-size: 16px; font-weight: 600; cursor: pointer; color: ${this.activeTab === 'active' ? '#4f46e5' : '#6b7280'}; border-bottom: ${this.activeTab === 'active' ? '2px solid #4f46e5' : 'none'}; padding-bottom: 8px;">Active Meetings</button>
                            <button @click=${() => { this.activeTab = 'completed'; this.fetchMeetings(); }} style="background: none; border: none; font-size: 16px; font-weight: 600; cursor: pointer; color: ${this.activeTab === 'completed' ? '#4f46e5' : '#6b7280'}; border-bottom: ${this.activeTab === 'completed' ? '2px solid #4f46e5' : 'none'}; padding-bottom: 8px;">Completed</button>
                        </div>
                    </div>

                    <div class="notes-toolbar" style="margin-bottom: 24px;">
                        <div class="search-box" style="flex: 1;">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            <input class="search-input" type="text" placeholder="Search meetings..."
                                .value=${this.searchQuery}
                                @input=${e => this.searchQuery = e.target.value} style="width: 100%; border: none; outline: none; background: transparent; margin-left: 8px;" />
                        </div>
                        ${this.activeTab === 'completed' ? html`
                            <button class="notes-btn" style="color: #dc2626; border-color: #fca5a5; background: #fef2f2; margin-left: auto;" @click=${this.clearAllHistory}>
                                Clear History
                            </button>
                        ` : ''}
                    </div>

                    <div class="grid-view" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px;">
"""

content = content.replace("""<div class="page-header-row">
                        <h2 class="page-title">Meetings</h2>
                    </div>

                    <div class="notes-toolbar">
                        <div class="toolbar-actions">
                            <button class="notes-btn primary" @click=${() => this.dispatchEvent(new CustomEvent('new-meeting', { bubbles: true, composed: true }))}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                New Meeting
                            </button>
                        </div>

                        <div class="search-box">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            <input class="search-input" type="text" placeholder="Search meetings..."
                                .value=${this.searchQuery}
                                @input=${e => this.searchQuery = e.target.value} />
                        </div>

                        <div style="display:flex;gap:4px;flex-shrink:0;">
                            <button class="icon-btn ${this.viewMode === 'list' ? 'active' : ''}" title="List view" @click=${() => this.viewMode = 'list'}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                            </button>
                            <button class="icon-btn ${this.viewMode === 'grid' ? 'active' : ''}" title="Grid view" @click=${() => this.viewMode = 'grid'}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                            </button>
                        </div>
                    </div>

                    <div class="${this.viewMode}-view">""", new_header)

card_footer_regex = r"<div class=\"card-footer\">[\s\S]*?</div>"
new_card_footer = """
                                <div class="card-footer" style="display: flex; flex-direction: column; gap: 12px; border-top: 1px solid #e5e7eb; padding-top: 16px; margin-top: auto;">
                                    <div style="display: flex; gap: 8px;">
                                        <button class="notes-btn primary" style="flex: 1; justify-content: center; padding: 8px;" @click=${() => this.startMeeting(m)}>Start / Join</button>
                                        ${this.activeTab === 'active' ? html`<button class="notes-btn" style="flex: 1; justify-content: center; padding: 8px;" @click=${() => this.editMeeting(m)}>Edit</button>` : ''}
                                        <button class="notes-btn" style="padding: 8px; color: #dc2626; border-color: #fca5a5;" @click=${() => this.deleteMeeting(m.id)}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                        </button>
                                    </div>
                                    <div style="display: flex; gap: 4px; justify-content: space-between; border-top: 1px solid #f3f4f6; padding-top: 8px;">
                                        <button class="icon-btn" title="Copy Link" @click=${() => this.handleSocialShare('copy', m)}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                                        </button>
                                        <button class="icon-btn" title="WhatsApp" @click=${() => this.handleSocialShare('whatsapp', m)}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                        </button>
                                        <button class="icon-btn" title="Gmail" @click=${() => this.handleSocialShare('gmail', m)}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                                        </button>
                                        <button class="icon-btn" title="Outlook" @click=${() => this.handleSocialShare('outlook', m)}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                                        </button>
                                    </div>
                                </div>
"""
content = re.sub(card_footer_regex, new_card_footer.strip(), content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Dashboard Updated")
