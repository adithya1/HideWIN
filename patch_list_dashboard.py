import re
with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\MeetingDashboardView.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Add a timer property and setInterval logic
timer_props = """        viewMode: { type: String },
        activeTab: { type: String },
        now: { type: Number }"""
content = content.replace("viewMode: { type: String },\n        activeTab: { type: String }", timer_props)

timer_init = """        this.viewMode = 'list';
        this.activeTab = 'active'; // Default to list to match reference
        this.now = Date.now();"""
content = content.replace("this.viewMode = 'grid';\n        this.activeTab = 'active'; // Default to grid to match reference", timer_init)

timer_logic = """    firstUpdated() {
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
        desc += `\n\nJoin link: ${this.apiUrl.replace('/api/meetings/upcoming', '/invite/index.html')}?channel=${m.id}&passcode=${m.recurrence && m.recurrence !== 'none' ? m.recurrence : m.id.split('-').pop().toLowerCase()}`;
        
        const details = encodeURIComponent(desc);
        const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}`;
        window.open(url, '_blank');
    }
"""
content = content.replace("firstUpdated() {\n        this.fetchMeetings();\n    }", timer_logic)

# Replace the HTML block to add the list/grid toggle and the posh-list rendering
old_grid_regex = r"<div class=\"grid-viewport\" style=\"padding-top: 12px;\">[\s\S]*?</div>\s*</div>\s*</div>\s*`;"

new_html = """
                    <div class="grid-viewport" style="padding-top: 12px;">
                        <div style="display: flex; justify-content: flex-end; margin-bottom: 16px; gap: 8px;">
                            <button class="icon-btn ${this.viewMode === 'list' ? 'active' : ''}" style="border: 1px solid #e5e7eb; border-radius: 6px; padding: 6px; background: ${this.viewMode === 'list' ? '#e0e7ff' : '#fff'}; color: ${this.viewMode === 'list' ? '#4f46e5' : '#6b7280'}; cursor: pointer;" title="List view" @click=${() => this.viewMode = 'list'}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                            </button>
                            <button class="icon-btn ${this.viewMode === 'grid' ? 'active' : ''}" style="border: 1px solid #e5e7eb; border-radius: 6px; padding: 6px; background: ${this.viewMode === 'grid' ? '#e0e7ff' : '#fff'}; color: ${this.viewMode === 'grid' ? '#4f46e5' : '#6b7280'}; cursor: pointer;" title="Grid view" @click=${() => this.viewMode = 'grid'}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                            </button>
                        </div>
                        
                        ${this.isLoading ? html`<div style="padding:40px; text-align:center; color:#9ca3af; font-size:16px; font-weight:500;">Loading your meetings...</div>` : ''}
                        ${!this.isLoading && filteredMeetings.length === 0 ? html`<div style="padding:60px 20px; text-align:center; color:#9ca3af; font-size:16px; font-weight:500; background:#f9fafb; border-radius:16px; border:2px dashed #e5e7eb; margin-top:20px;">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom:16px; color:#d1d5db;"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                            <br>No meetings found in this view.
                        </div>` : ''}
                        
                        <div class="${this.viewMode === 'list' ? 'posh-list-layout' : 'posh-grid-layout'}">
                            ${filteredMeetings.map(m => html`
                                ${this.viewMode === 'grid' ? html`
                                <div class="posh-card">
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
                                <div class="posh-list-item">
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
            </div>
        `;
"""
content = re.sub(old_grid_regex, new_html, content)

# Inject posh-list CSS
posh_list_css = """
            .posh-list-layout {
                display: flex;
                flex-direction: column;
                gap: 16px;
                padding: 8px 4px 24px 4px;
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
                transform: translateY(-2px);
                box-shadow: 0 8px 20px rgba(0,0,0,0.06);
            }
            .posh-list-info {
                flex: 1;
            }
            .posh-list-actions {
                display: flex;
                align-items: center;
            }
"""
content = content.replace(".posh-grid-layout {", posh_list_css + "\n            .posh-grid-layout {")

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\MeetingDashboardView.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated MeetingDashboardView.js with List logic")
