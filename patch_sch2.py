import re
with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\ScheduleMeetingView.js', 'r', encoding='utf-8') as f:
    content = f.read()

new_render_logic = """
    getFormattedTemplate(isHtml = false) {
        if (!this.createdMeeting) return '';
        const cloudHost = window.location.hostname;
        const protocol = window.location.protocol.replace(':', '');
        const passcode = this.createdMeeting.recurrence && this.createdMeeting.recurrence !== 'none' ? this.createdMeeting.recurrence : (this.createdMeeting.id ? this.createdMeeting.id.split('-').pop().toLowerCase() : '');
        // Note: the backend uses the dnsIP, so we should reconstruct it safely
        const joinLink = `http://127.0.0.1:8000/invite/index.html?channel=${this.createdMeeting.id}&passcode=${passcode}`; // fallback
        
        const title = this.createdMeeting.title;
        const time = `${this.startDate} at ${this.startTime} (${this.timezone})`;
        
        if (isHtml) {
            return `<b>You are invited to a HideWIN Meeting!</b><br><br><b>Topic:</b> ${title}<br><b>Time:</b> ${time}<br><br><b>Join Meeting:</b><br><a href="${joinLink}">${joinLink}</a><br><br><b>Meeting ID:</b> ${this.createdMeeting.id}<br><b>Passcode:</b> ${passcode}`;
        }
        
        return `📅 You are invited to a HideWIN Meeting!\n\nTopic: ${title}\nTime: ${time}\n\n🔗 Join Meeting:\n${joinLink}\n\nMeeting ID: ${this.createdMeeting.id}\nPasscode: ${passcode}`;
    }

    async handleSocialShare(platform) {
        const text = this.getFormattedTemplate(false);
        const htmlText = this.getFormattedTemplate(true);
        const subject = encodeURIComponent(`Meeting Invite: ${this.createdMeeting.title}`);
        
        if (platform === 'copy') {
            navigator.clipboard.writeText(text).catch(()=>{});
            this.showToast("Details copied to clipboard!", "success");
        } else if (platform === 'whatsapp') {
            window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
        } else if (platform === 'gmail') {
            window.open(`https://mail.google.com/mail/?view=cm&fs=1&su=${subject}&body=${encodeURIComponent(text)}`, '_blank');
        } else if (platform === 'outlook') {
            window.open(`mailto:?subject=${subject}&body=${encodeURIComponent(text)}`, '_self');
        } else if (platform === 'hidewin') {
            this.showEmailDrawer = !this.showEmailDrawer;
            if (this.showEmailDrawer) {
                setTimeout(() => {
                    const editor = this.shadowRoot.querySelector('#description-editor');
                    if (editor) editor.innerHTML = htmlText;
                }, 100);
            }
            this.requestUpdate();
        }
    }

    async sendDelayedInvites() {
        if (!this.createdMeeting) return;
        try {
            const { ipcRenderer } = window.require('electron');
            const prefsStr = await ipcRenderer.invoke('storage:get-preferences');
            let dnsIP = '127.0.0.1'; let dnsPort = '8000';
            if (prefsStr) {
                 const prefs = JSON.parse(prefsStr);
                 if (prefs.dnsIP) dnsIP = prefs.dnsIP;
            }
            const apiUrl = dnsIP.includes('.loca.lt') ? `https://${dnsIP}/api/meetings/${this.createdMeeting.id}/send-invites` : `http://${dnsIP}:${dnsPort}/api/meetings/${this.createdMeeting.id}/send-invites`;
            
            const formData = new FormData();
            const editor = this.shadowRoot.querySelector('#description-editor');
            const currentDesc = editor ? editor.innerHTML : '';
            
            const inviteData = {
                participants: this.attendees,
                cc_participants: this.ccAttendees,
                bcc_participants: this.bccAttendees,
                invite_url_base: dnsIP.includes('.loca.lt') ? `https://${dnsIP}/invite/index.html` : `http://${dnsIP}:${dnsPort}/invite/index.html`,
                description_override: currentDesc
            };
            formData.append('invite_data', JSON.stringify(inviteData));
            this.attachments.forEach(file => { formData.append('files', file); });
            
            this.showToast("Sending invites...", "success");
            const tokenResponse = await ipcRenderer.invoke('storage:get-credentials');
            let token = "";
            if (tokenResponse) {
                const creds = JSON.parse(tokenResponse);
                token = creds.jwtToken || "";
            }

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });
            
            if (response.ok) {
                this.showToast("Invites Sent Successfully!", "success");
                setTimeout(() => {
                    this.dispatchEvent(new CustomEvent('close-meeting', { bubbles: true, composed: true }));
                }, 1500);
            } else {
                this.showToast("Failed to send invites", "error");
            }
        } catch(err) {
            this.showToast("Error: " + err.message, "error");
        }
    }

    renderCreateStep() {
        return html`
            <div class="teams-container step-create">
                ${this.toastMessage ? html`<div class="toast-notification ${this.toastType}">${this.toastMessage}</div>` : ''}
                <div class="header">
                    <div class="header-left">
                        <div class="header-icon" style="background:#f3f2f1;color:#2563eb;border-radius:8px;padding:8px">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        </div>
                        <h2 class="header-title" style="font-size:22px;font-weight:600;margin-left:16px;">Schedule Meeting</h2>
                    </div>
                    <div class="header-actions">
                        <button class="btn" @click=${() => this.dispatchEvent(new CustomEvent('close-meeting', { bubbles: true, composed: true }))}>Cancel</button>
                        <button class="btn btn-primary" style="font-weight:600;padding:8px 24px" @click=${this.saveMeeting}>Generate</button>
                    </div>
                </div>
                
                <div class="form-body" style="max-width:800px; margin:0 auto; padding: 40px 24px;">
                    <input type="text" class="input-field title-input" style="font-size:32px; font-weight:700; border:none; border-bottom:2px solid #e1dfdd; padding-bottom:12px; margin-bottom:40px; border-radius:0; box-shadow:none; background:transparent" placeholder="Meeting Title" .value=${this.title} @input=${e => this.title = e.target.value}>
                    
                    <div style="display:flex; gap:24px; margin-bottom:32px">
                        <div style="flex:1">
                            <label style="font-size:13px; font-weight:600; color:#605e5c; margin-bottom:8px; display:block">Date</label>
                            <div style="display:flex; gap:12px">
                                <input type="date" class="input-field" style="flex:1; padding:12px; font-size:15px" .value=${this.startDate} @change=${e => {this.startDate = e.target.value; this.endDate = e.target.value}}>
                            </div>
                        </div>
                        <div style="flex:1">
                            <label style="font-size:13px; font-weight:600; color:#605e5c; margin-bottom:8px; display:block">Time</label>
                            <div style="display:flex; gap:12px; align-items:center">
                                <input type="time" class="input-field" style="flex:1; padding:12px; font-size:15px" .value=${this.startTime} @change=${e => this.startTime = e.target.value}>
                                <span style="color:#605e5c;font-weight:600">to</span>
                                <input type="time" class="input-field" style="flex:1; padding:12px; font-size:15px" .value=${this.endTime} @change=${e => this.endTime = e.target.value}>
                            </div>
                        </div>
                    </div>

                    <div style="margin-bottom:32px">
                        <label style="font-size:13px; font-weight:600; color:#605e5c; margin-bottom:8px; display:block">Timezone</label>
                        <select class="input-field" style="width:100%; padding:12px; font-size:15px" .value=${this.timezone} @change=${e => this.timezone = e.target.value}>
                            ${TIMEZONES.map(tz => html`<option value="${tz.value}" ?selected=${this.timezone === tz.value}>${tz.label}</option>`)}
                        </select>
                    </div>
                </div>
            </div>
        `;
    }

    renderShareStep() {
        const passcode = this.createdMeeting.recurrence && this.createdMeeting.recurrence !== 'none' ? this.createdMeeting.recurrence : (this.createdMeeting.id ? this.createdMeeting.id.split('-').pop().toLowerCase() : '');
        return html`
            <div class="teams-container step-share">
                ${this.toastMessage ? html`<div class="toast-notification ${this.toastType}">${this.toastMessage}</div>` : ''}
                <div class="header">
                    <div class="header-left">
                        <div class="header-icon" style="background:#dcfce7;color:#16a34a;border-radius:50%;padding:8px">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </div>
                        <h2 class="header-title" style="font-size:22px;font-weight:600;margin-left:16px;">Meeting Ready!</h2>
                    </div>
                    <div class="header-actions">
                        <button class="btn" @click=${() => this.dispatchEvent(new CustomEvent('close-meeting', { bubbles: true, composed: true }))}>Done</button>
                    </div>
                </div>

                <div class="form-body" style="max-width:800px; margin:0 auto; padding: 40px 24px; display:flex; flex-direction:column; gap:32px; align-items:center">
                    
                    <!-- Ticket Card -->
                    <div style="background:#ffffff; border:1px solid #e5e7eb; border-radius:16px; padding:32px; width:100%; box-shadow:0 10px 30px rgba(0,0,0,0.05); position:relative; overflow:hidden">
                        <div style="position:absolute; top:0; left:0; width:6px; height:100%; background:var(--accent);"></div>
                        <h3 style="margin:0 0 8px 0; font-size:24px; color:#111827">${this.createdMeeting.title}</h3>
                        <p style="margin:0 0 24px 0; font-size:15px; color:#6b7280; display:flex; align-items:center; gap:8px">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                            ${this.startDate} at ${this.startTime}
                        </p>
                        
                        <div style="display:flex; gap:24px; background:#f9fafb; padding:16px; border-radius:8px">
                            <div>
                                <span style="font-size:12px; font-weight:600; color:#6b7280; text-transform:uppercase; letter-spacing:0.5px">Meeting ID</span>
                                <div style="font-size:18px; font-weight:700; color:#111827; margin-top:4px; font-family:monospace">${this.createdMeeting.id}</div>
                            </div>
                            <div>
                                <span style="font-size:12px; font-weight:600; color:#6b7280; text-transform:uppercase; letter-spacing:0.5px">Passcode</span>
                                <div style="font-size:18px; font-weight:700; color:#111827; margin-top:4px; font-family:monospace">${passcode}</div>
                            </div>
                        </div>
                    </div>

                    <!-- Share Options -->
                    <div style="width:100%">
                        <h4 style="margin:0 0 16px 0; font-size:16px; color:#4b5563">Share Invites</h4>
                        <div style="display:grid; grid-template-columns:repeat(5, 1fr); gap:12px">
                            <button class="social-btn copy" @click=${() => this.handleSocialShare('copy')}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                                <span>Copy Text</span>
                            </button>
                            <button class="social-btn whatsapp" @click=${() => this.handleSocialShare('whatsapp')}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                <span>WhatsApp</span>
                            </button>
                            <button class="social-btn gmail" @click=${() => this.handleSocialShare('gmail')}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                                <span>Gmail</span>
                            </button>
                            <button class="social-btn outlook" @click=${() => this.handleSocialShare('outlook')}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                                <span>Outlook</span>
                            </button>
                            <button class="social-btn hidewin" @click=${() => this.handleSocialShare('hidewin')}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                                <span>Advanced</span>
                            </button>
                        </div>
                    </div>

                    <!-- Advanced HideWIN Email Drawer -->
                    ${this.showEmailDrawer ? html`
                        <div style="width:100%; border-top:1px solid #e5e7eb; padding-top:24px; margin-top:8px; animation: slideDown 0.3s ease-out">
                            <h4 style="margin:0 0 16px 0; font-size:16px; color:#4b5563">Send Advanced Invites</h4>
                            
                            <!-- To / Cc / Bcc Fields (Reused from previous logic) -->
                            <div style="display:flex; flex-direction:column; gap:12px; margin-bottom:24px">
                                <div class="input-field attendees-container" style="padding:8px; display:flex; flex-wrap:wrap; gap:6px; min-height:44px; align-items:center">
                                    <span style="font-size:13px; font-weight:600; color:#6b7280; margin-right:8px">To:</span>
                                    ${this.attendees.map((email, i) => html`
                                        <div class="attendee-chip" style="background:#e5e7eb; padding:4px 10px; border-radius:16px; font-size:13px; display:flex; align-items:center; gap:6px">
                                            ${email} <span style="cursor:pointer; font-weight:bold" @click=${()=>this.removeAttendee(i, 'to')}>&times;</span>
                                        </div>
                                    `)}
                                    <input type="text" class="attendee-input" style="border:none; outline:none; flex:1; min-width:150px; background:transparent" placeholder="Type emails and press Space..." @keydown=${e=>this.handleAttendeeKeyDown(e, 'to', e.target)} @blur=${e=>this.handleAttendeeBlur(e, 'to', e.target)} @paste=${e=>this.handleAttendeePaste(e, 'to')}>
                                </div>
                            </div>
                            
                            <!-- Toolbar and Editor -->
                            <div class="editor-container" style="border:1px solid #e5e7eb; border-radius:12px; overflow:hidden">
                                <!-- Keeping it simple here, assuming toolbar styles are preserved -->
                                <div id="description-editor" class="editor-content" style="width:100%; min-height:200px; padding:16px; outline:none; overflow-y:auto;" contenteditable="true"></div>
                            </div>
                            
                            <div style="display:flex; justify-content:space-between; margin-top:24px">
                                <button class="btn" style="display:flex; gap:8px; align-items:center" @click=${() => this.triggerAttachment()}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
                                    Attach Files
                                </button>
                                <input type="file" id="file-attachment" multiple style="display:none" @change=${this.handleAttachment}>
                                <button class="btn btn-primary" style="padding:10px 32px; font-weight:600" @click=${this.sendDelayedInvites}>Send Invites</button>
                            </div>
                        </div>
                    ` : ''}

                </div>
            </div>
        `;
    }

    render() {
        if (this.step === 'create') return this.renderCreateStep();
        if (this.step === 'share') return this.renderShareStep();
    }
"""

content = re.sub(r'render\(\) \{.*', new_render_logic, content, flags=re.DOTALL)

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\ScheduleMeetingView.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated Phase 2 HTML logic")
