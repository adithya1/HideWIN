import { LitElement, html, css } from '../../assets/lit-core-2.7.4.min.js';
import { unifiedPageStyles } from './sharedPageStyles.js';

export class MeetingDashboardView extends LitElement {
    static properties = {
        meetings: { type: Array },
        isLoading: { type: Boolean },
        toastMessage: { type: String },
        toastType: { type: String },
        searchQuery: { type: String },
                viewMode: { type: String },
        viewingMeeting: { type: Object },
        activeTab: { type: String },
        now: { type: Number }
    };

    static styles = [
        unifiedPageStyles,
        css`
            * { box-sizing: border-box; }

            /* Minimal overrides to reuse unified styles for Meetings */

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
                
            }
            .share-apps-row
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

            .toast-notification {
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: #333;
                color: white;
                padding: 12px 24px;
                border-radius: 4px;
                z-index: 1000;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            }
            .toast-notification.success { background: #107c10; }
            .toast-notification.error { background: #d13438; }
            
            .card-type-badge.ACTIVE { background: #dff6dd; color: #107c10; }
            .card-type-badge.SCHEDULED { background: #e1dfdd; color: #323130; }

            .posh-card {
                background: #ffffff;
                border-radius: 16px;
                padding: 24px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.02);
                border: 1px solid #f3f4f6;
                transition: transform 0.2s ease, box-shadow 0.2s ease;
                display: flex;
                flex-direction: column;
                position: relative;
                overflow: hidden;
            }
            .posh-card:hover {
                                box-shadow: 0 12px 30px rgba(0,0,0,0.08), 0 4px 6px rgba(0,0,0,0.04);
            }
            
            .posh-card-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 16px;
            }
            .posh-card-title {
                font-size: 18px;
                font-weight: 700;
                color: #111827;
                margin: 0;
                line-height: 1.3;
            }
            .posh-badge {
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 600;
                letter-spacing: 0.5px;
                text-transform: uppercase;
            }
            .posh-badge.SCHEDULED { background: #e0e7ff; color: #4338ca; }
            .posh-badge.ACTIVE { background: #dcfce7; color: #166534; }
            .posh-badge.COMPLETED { background: #f3f4f6; color: #4b5563; }
            
            .posh-card-body {
                display: flex;
                flex-direction: column;
                gap: 12px;
                margin-bottom: 24px;
                flex: 1;
            }
            .posh-detail-row {
                display: flex;
                align-items: center;
                gap: 8px;
                color: #4b5563;
                font-size: 14px;
                font-weight: 500;
            }
            .posh-detail-icon {
                color: #9ca3af;
                width: 16px;
                height: 16px;
            }
            
            .posh-actions-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 12px;
                margin-bottom: 16px;
            }
            .posh-btn {
                border: none;
                border-radius: 8px;
                padding: 10px 16px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }
            .posh-btn-primary {
                background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%);
                color: white;
                box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
            }
            .posh-btn-primary:hover {
                box-shadow: 0 6px 16px rgba(79, 70, 229, 0.3);
                            }
            .posh-btn-secondary {
                background: #f3f4f6;
                color: #374151;
            }
            .posh-btn-secondary:hover {
                background: #e5e7eb;
            }
            .posh-btn-danger {
                background: #fef2f2;
                color: #ef4444;
            }
            .posh-btn-danger:hover {
                background: #fee2e2;
            }
            
            .posh-social-row {
                display: flex;
                justify-content: center;
                gap: 12px;
                padding-top: 16px;
                border-top: 1px solid #f3f4f6;
            }
            .posh-social-btn {
                background: white;
                border: 1px solid #e5e7eb;
                border-radius: 50%;
                width: 36px;
                height: 36px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                color: #6b7280;
                transition: all 0.2s ease;
            }
            .posh-social-btn:hover {
                background: #f9fafb;
                color: #111827;
                border-color: #d1d5db;
                            }
            
            
            .posh-list-layout {
                display: flex;
                flex-direction: column;
                gap: 16px;
                padding: 16px 24px 32px 24px;
                margin: 0 auto;
                width: 100%;
                max-width: 1100px;
            }
            .posh-list-item {
                background: #ffffff;
                border-radius: 12px;
                padding: 20px 24px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                border: 1px solid #f3f4f6;
                display: flex;
                align-items: center;
                justify-content: space-between;
                transition: transform 0.2s ease, box-shadow 0.2s ease;
            }
            .posh-list-item:hover {
                                box-shadow: 0 8px 20px rgba(0,0,0,0.06);
            }
            .posh-list-info {
                flex: 1;
            }
            .posh-list-actions {
                display: flex;
                align-items: center;
            }

            .posh-grid-layout {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
                gap: 24px;
                padding: 8px 4px 24px 4px;
            }

        `
    ];

    constructor() {
        super();
        this.meetings = [];
        this.isLoading = true;
        this.searchQuery = '';
                this.viewMode = 'list';
        this.viewingMeeting = null;
        this.activeTab = 'active'; // Default to list to match reference
        this.now = Date.now();
    }

        firstUpdated() {
        this.fetchMeetings();
        this._timerInterval = setInterval(() => { this.now = Date.now(); }, 60000);
    }
    
    disconnectedCallback() {
        super.disconnectedCallback();
        if (this._timerInterval) clearInterval(this._timerInterval);
    }
    
    getTimeUntil(dateStr) {
        const diff = new Date(dateStr).getTime() - this.now;
        if (diff < 0 && diff > -3600000) return 'Started';
        if (diff <= 0) return '';
        
        const mins = Math.floor((diff / 1000) / 60);
        if (mins < 60) return `In ${mins} min${mins !== 1 ? 's' : ''}`;
        
        const hours = Math.floor(mins / 60);
        const remMins = mins % 60;
        if (hours < 24) return `In ${hours}h ${remMins}m`;
        
        const days = Math.floor(hours / 24);
        return `In ${days} day${days !== 1 ? 's' : ''}`;
    }
    
    openGoogleCalendar(m) {
        const title = encodeURIComponent(m.title || 'Meeting');
        const d1 = new Date(m.start_time);
        const d2 = m.end_time ? new Date(m.end_time) : new Date(d1.getTime() + 3600000);
        
        const fmt = (d) => d.toISOString().replace(/-|:|\.\d\d\d/g, '');
        const dates = `${fmt(d1)}/${fmt(d2)}`;
        
        let desc = m.description || '';
        // If there's an invite link available in the dashboard...
        desc += `

Join link: ${this.apiUrl.replace('/api/meetings/upcoming', '/invite/index.html')}?channel=${m.id}&passcode=${m.recurrence && m.recurrence !== 'none' ? m.recurrence : m.id.split('-').pop().toLowerCase()}`;
        
        const details = encodeURIComponent(desc);
        const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}`;
        window.open(url, '_blank');
    }


    async fetchMeetings() {
        this.isLoading = true;
        try {
            const { ipcRenderer } = window.require('electron');
            const tokenResponse = await ipcRenderer.invoke('storage:get-credentials');
            let token = "";
            if (tokenResponse) {
                let creds = typeof tokenResponse === 'string' ? JSON.parse(tokenResponse) : tokenResponse;
                if (creds && creds.data) creds = creds.data;
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
                const data = await res.json(); this.meetings = Array.isArray(data) ? data : (data.meetings || []);
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
                        let token = "";
            if (tokenResponse) {
                let creds = typeof tokenResponse === 'string' ? JSON.parse(tokenResponse) : tokenResponse;
                if (creds && creds.data) creds = creds.data;
                token = creds.jwtToken || "";
            }
            
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
                        let token = "";
            if (tokenResponse) {
                let creds = typeof tokenResponse === 'string' ? JSON.parse(tokenResponse) : tokenResponse;
                if (creds && creds.data) creds = creds.data;
                token = creds.jwtToken || "";
            }
            
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
        
        let shareText = `Join my meeting: ${meeting.title}

Link: ${inviteLink}`;
        
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

    startMeeting(meeting) {
        this.dispatchEvent(new CustomEvent('start-existing-meeting', { 
            detail: { ...meeting, passcode: meeting.recurrence && meeting.recurrence !== 'none' ? meeting.recurrence : meeting.id.split('-').pop().toLowerCase() },
            bubbles: true, 
            composed: true 
        }));
    }

    async copyInvite(meeting) {
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
        
        const inviteLink = `${protocol}://${cloudHost}/invite/index.html?channel=${meeting.id}&passcode=${passcode}`;
        navigator.clipboard.writeText(inviteLink);
        
        this.toastMessage = "Invite link copied to clipboard!";
        this.toastType = 'success';
        this.requestUpdate();
        setTimeout(() => {
            this.toastMessage = null;
            this.requestUpdate();
        }, 3000);
    }

    render() {
        const filteredMeetings = this.meetings.filter(m => {
            if (!this.searchQuery) return true;
            return m.title.toLowerCase().includes(this.searchQuery.toLowerCase());
        });

        return html`
            <div class="unified-page">
                ${this.toastMessage ? html`<div class="toast-notification ${this.toastType}">${this.toastMessage}</div>` : ''}
                
                <div class="unified-wrap">
                    <div class="page-header-row">
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
                            <button class="icon-btn" title="Toggle View" @click=${() => this.viewMode = this.viewMode === 'list' ? 'grid' : 'list'} style="background: var(--bg-surface); border: 1px solid var(--border); border-radius: 6px; padding: 4px; color: var(--text-secondary); cursor: pointer;">
                                ${this.viewMode === 'list' 
                                    ? html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect></svg>`
                                    : html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`
                                }
                            </button>
                        </div>
                    </div>
                    
                    
                    <div class="grid-viewport" style="padding-top: 12px;">
                        
                        
                        ${this.isLoading ? html`<div style="padding:40px; text-align:center; color:#9ca3af; font-size:16px; font-weight:500;">Loading your meetings...</div>` : ''}
                        ${!this.isLoading && filteredMeetings.length === 0 ? html`<div style="padding:60px 20px; text-align:center; color:#9ca3af; font-size:16px; font-weight:500; background:#f9fafb; border-radius:16px; border:2px dashed #e5e7eb; margin-top:20px;">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom:16px; color:#d1d5db;"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                            <br>No meetings found in this view.
                        </div>` : ''}
                        
                        <div class="${this.viewMode === 'list' ? 'posh-list-layout' : 'posh-grid-layout'}">
                            ${filteredMeetings.map(m => html`
                                ${this.viewMode === 'grid' ? html`
                                <div class="posh-card" @click=${(e) => { if(!e.target.closest("button")) this.viewingMeeting = m; }} style="cursor: pointer;">
                                    <div class="posh-card-header">
                                        <h3 class="posh-card-title">${m.title}</h3>
                                        <span class="posh-badge ${m.status}">${m.status}</span>
                                    </div>
                                    <div class="posh-card-body">
                                        <div class="posh-detail-row">
                                            <svg class="posh-detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                            ${new Date(m.start_time).toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                        ${this.activeTab === 'active' && this.getTimeUntil(m.start_time) ? html`
                                            <div class="posh-detail-row" style="color: #ea580c; font-weight: 600;">
                                                <svg class="posh-detail-icon" style="color: #ea580c;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                                ${this.getTimeUntil(m.start_time)}
                                            </div>
                                        ` : ''}
                                    </div>
                                    <div class="posh-actions-grid">
                                        <button class="posh-btn posh-btn-primary" style="grid-column: span 2;" @click=${() => this.startMeeting(m)}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                                            Start / Join
                                        </button>
                                        ${this.activeTab === 'active' ? html`<button class="posh-btn posh-btn-secondary" @click=${() => this.editMeeting(m)}>Edit</button>` : ''}
                                        <button class="posh-btn posh-btn-danger" @click=${() => this.deleteMeeting(m.id)}>Delete</button>
                                    </div>
                                    <div class="posh-social-row">
                                        <button class="posh-social-btn" title="Add to Google Calendar" @click=${() => this.openGoogleCalendar(m)}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line><path d="M8 14h.01"></path><path d="M12 14h.01"></path><path d="M16 14h.01"></path><path d="M8 18h.01"></path><path d="M12 18h.01"></path><path d="M16 18h.01"></path></svg>
                                        </button>
                                        <button class="posh-social-btn" title="Copy Link" @click=${() => this.handleSocialShare('copy', m)}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                                        </button>
                                        <button class="posh-social-btn" title="WhatsApp" @click=${() => this.handleSocialShare('whatsapp', m)}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                        </button>
                                    </div>
                                </div>
                                ` : html`
                                <div class="posh-list-item" @click=${(e) => { if(!e.target.closest("button")) this.viewingMeeting = m; }} style="cursor: pointer;">
                                    <div class="posh-list-info">
                                        <span class="posh-badge ${m.status}" style="margin-bottom: 8px; display: inline-block;">${m.status}</span>
                                        <h3 class="posh-card-title">${m.title}</h3>
                                        <div class="posh-detail-row" style="margin-top: 8px;">
                                            <svg class="posh-detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                            ${new Date(m.start_time).toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            ${this.activeTab === 'active' && this.getTimeUntil(m.start_time) ? html`
                                                <span style="color: #ea580c; font-weight: 600; margin-left: 8px; display: inline-flex; align-items: center; gap: 4px;">
                                                    <span style="width: 4px; height: 4px; border-radius: 50%; background: #ea580c; display: inline-block;"></span>
                                                    ${this.getTimeUntil(m.start_time)}
                                                </span>
                                            ` : ''}
                                        </div>
                                    </div>
                                    <div class="posh-list-actions">
                                        <div class="posh-social-row-list" style="display: flex; gap: 8px; margin-right: 16px;">
                                            <button class="posh-social-btn" title="Add to Google Calendar" @click=${() => this.openGoogleCalendar(m)}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line><path d="M8 14h.01"></path><path d="M12 14h.01"></path><path d="M16 14h.01"></path><path d="M8 18h.01"></path><path d="M12 18h.01"></path><path d="M16 18h.01"></path></svg></button>
                                            <button class="posh-social-btn" title="Copy Link" @click=${() => this.handleSocialShare('copy', m)}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg></button>
                                            <button class="posh-social-btn" title="WhatsApp" @click=${() => this.handleSocialShare('whatsapp', m)}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg></button>
                                        </div>
                                        <div style="display: flex; gap: 8px;">
                                            ${this.activeTab === 'active' ? html`<button class="posh-btn posh-btn-secondary" style="padding: 8px 12px;" @click=${() => this.editMeeting(m)}>Edit</button>` : ''}
                                            <button class="posh-btn posh-btn-danger" style="padding: 8px 12px;" @click=${() => this.deleteMeeting(m.id)}>Delete</button>
                                            <button class="posh-btn posh-btn-primary" style="padding: 8px 24px;" @click=${() => this.startMeeting(m)}>Start / Join</button>
                                        </div>
                                    </div>
                                </div>
                                `}
                            `)}
                        </div>
                    </div>
                </div>

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
                                    <div class="share-info-row" style="align-items: flex-start; padding: 4px 0;">
                                        <span class="share-info-label" style="margin-top: 4px;">Scheduled</span>
                                        <span class="share-info-value" style="display: flex; flex-direction: column; align-items: flex-end; gap: 8px;">
                                            <span style="font-size: 14px; color: #4b5563;">${new Date(this.viewingMeeting.start_time).toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                            ${this.getTimeUntil(this.viewingMeeting.start_time) ? html`
                                                <span style="color: #ea580c; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; display: inline-flex; align-items: center; gap: 6px; background: #fff7ed; padding: 4px 12px; border-radius: 20px; border: 1px solid #ffedd5;">
                                                    <span style="width: 6px; height: 6px; border-radius: 50%; background: #ea580c; display: inline-block;"></span>
                                                    ${this.getTimeUntil(this.viewingMeeting.start_time)}
                                                </span>
                                            ` : html`
                                                <span style="color: #059669; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; display: inline-flex; align-items: center; gap: 6px; background: #ecfdf5; padding: 4px 12px; border-radius: 20px; border: 1px solid #d1fae5;">
                                                    <span style="width: 6px; height: 6px; border-radius: 50%; background: #059669; display: inline-block;"></span>
                                                    ${this.viewingMeeting.status}
                                                </span>
                                            `}
                                        </span>
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
                                                                        <button class="share-app-btn" @click=${() => this.handleSocialShare('gmail', this.viewingMeeting)}>
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

    }
}
customElements.define('meeting-dashboard-view', MeetingDashboardView);
