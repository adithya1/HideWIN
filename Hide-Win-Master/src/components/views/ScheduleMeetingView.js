import { LitElement, html, css } from '../../assets/lit-core-2.7.4.min.js';
import { scheduleMeetingStyles } from './ScheduleMeetingView.styles.js';


const TIMEZONES = [
    { value: "Pacific/Midway", label: "(GMT-11:00) Midway Island, Samoa" },
    { value: "America/Honolulu", label: "(GMT-10:00) Hawaii" },
    { value: "America/Juneau", label: "(GMT-09:00) Alaska" },
    { value: "America/Los_Angeles", label: "(GMT-08:00) Pacific Time (US & Canada)" },
    { value: "America/Denver", label: "(GMT-07:00) Mountain Time (US & Canada)" },
    { value: "America/Chicago", label: "(GMT-06:00) Central Standard Time (CST) - Chicago, Mexico City" },
    { value: "America/New_York", label: "(GMT-05:00) Eastern Standard Time (EST) - New York, Bogota, Lima" },
    { value: "America/Caracas", label: "(GMT-04:30) Caracas" },
    { value: "America/Halifax", label: "(GMT-04:00) Atlantic Time (Canada), Caracas, La Paz" },
    { value: "America/St_Johns", label: "(GMT-03:30) Newfoundland" },
    { value: "America/Argentina/Buenos_Aires", label: "(GMT-03:00) Brazil, Buenos Aires, Georgetown" },
    { value: "Atlantic/South_Georgia", label: "(GMT-02:00) Mid-Atlantic" },
    { value: "Atlantic/Azores", label: "(GMT-01:00) Azores, Cape Verde Islands" },
    { value: "Europe/London", label: "(GMT+00:00) Western Europe Time, London, Lisbon, Casablanca" },
    { value: "Europe/Paris", label: "(GMT+01:00) Brussels, Copenhagen, Madrid, Paris" },
    { value: "Europe/Helsinki", label: "(GMT+02:00) Kaliningrad, South Africa" },
    { value: "Europe/Moscow", label: "(GMT+03:00) Baghdad, Riyadh, Moscow, St. Petersburg" },
    { value: "Asia/Tehran", label: "(GMT+03:30) Tehran" },
    { value: "Asia/Dubai", label: "(GMT+04:00) Abu Dhabi, Muscat, Baku, Tbilisi" },
    { value: "Asia/Kabul", label: "(GMT+04:30) Kabul" },
    { value: "Asia/Karachi", label: "(GMT+05:00) Ekaterinburg, Islamabad, Karachi, Tashkent" },
    { value: "Asia/Kolkata", label: "(GMT+05:30) Indian Standard Time (IST) - New Delhi, Mumbai" },
    { value: "Asia/Kathmandu", label: "(GMT+05:45) Kathmandu, Pokhara" },
    { value: "Asia/Dhaka", label: "(GMT+06:00) Almaty, Dhaka, Colombo" },
    { value: "Asia/Yangon", label: "(GMT+06:30) Yangon, Mandalay" },
    { value: "Asia/Bangkok", label: "(GMT+07:00) Bangkok, Hanoi, Jakarta" },
    { value: "Asia/Hong_Kong", label: "(GMT+08:00) Beijing, Perth, Singapore, Hong Kong" },
    { value: "Asia/Tokyo", label: "(GMT+09:00) Tokyo, Seoul, Osaka, Sapporo, Yakutsk" },
    { value: "Australia/Adelaide", label: "(GMT+09:30) Adelaide, Darwin" },
    { value: "Australia/Sydney", label: "(GMT+10:00) Eastern Australia, Guam, Vladivostok" },
    { value: "Asia/Magadan", label: "(GMT+11:00) Magadan, Solomon Islands, New Caledonia" },
    { value: "Pacific/Auckland", label: "(GMT+12:00) Auckland, Wellington, Fiji, Kamchatka" }
];

export class ScheduleMeetingView extends LitElement {
    static properties = {
        editMeeting: { type: Object },
        isFormatPainting: { type: Boolean },
        copiedFormat: { type: Object },
        title: { type: String },
        attendeeInput: { type: String },
        attendees: { type: Array },
        ccAttendees: { type: Array },
        bccAttendees: { type: Array },
        showCc: { type: Boolean },
        showBcc: { type: Boolean },
        attachments: { type: Array },
        editingAttendee: { type: Object },

        startDate: { type: String },
        startTime: { type: String },
        endDate: { type: String },
        endTime: { type: String },
        isAllDay: { type: Boolean },
        timezone: { type: String },
        recurrence: { type: String },
                description: { type: String },
        toastMessage: { type: String },
        toastType: { type: String }
    };

    static styles = scheduleMeetingStyles;


    constructor() {
        super();
        this.editMeeting = null;
        this.isFormatPainting = false;
        this.copiedFormat = null;
        this.title = '';
        
        this.step = 'create'; // 'create' | 'share'
        this.createdMeeting = null;
        this.showEmailDrawer = false;

        this.attendees = [];
        this.ccAttendees = [];
        this.bccAttendees = [];
        this.showCc = false;
        this.showBcc = false;
        this.attachments = [];
        this.editingAttendee = null; // { list: 'to'|'cc'|'bcc', index: number }

        this.attendeeInput = '';
        
        const now = new Date();
        this.startDate = now.toISOString().split('T')[0];
        this.endDate = this.startDate;
        
        const timeStr = now.toTimeString().substring(0,5);
        this.startTime = timeStr;
        this.endTime = new Date(now.getTime() + 30*60000).toTimeString().substring(0,5);
        
        this.isAllDay = false;
        this.timezone = 'UTC';
        this.recurrence = 'none';
                this.description = '';
    }

    showToast(msg, type = 'success') {
        this.toastMessage = msg;
        this.toastType = type;
        this.requestUpdate();
        setTimeout(() => {
            if (this.toastMessage === msg) {
                this.toastMessage = null;
                this.requestUpdate();
            }
        }, 5000);
    }
    
    handleAttendeeKeyDown(e, listType, inputObj) {
        if (e.key === 'Enter' || e.key === ',' || e.key === ';' || e.key === ' ' || e.key === 'Tab') {
            const email = inputObj.value.trim().replace(/[;,]$/, '');
            if (email) {
                e.preventDefault();
                this.addEmailBlock(listType, email);
                inputObj.value = '';
                this.requestUpdate();
            }
        }
    }

    addEmailBlock(listType, text) {
        // Split by spaces, commas, semicolons to handle bulk pastes/entries
        const emails = text.split(/[\s;,]+/).map(s => s.trim()).filter(Boolean);
        if (emails.length === 0) return;
        
        if (listType === 'to') this.attendees = [...this.attendees, ...emails];
        if (listType === 'cc') this.ccAttendees = [...this.ccAttendees, ...emails];
        if (listType === 'bcc') this.bccAttendees = [...this.bccAttendees, ...emails];
    }

    handleAttendeeBlur(e, listType, inputObj) {
        const email = inputObj.value.trim().replace(/[;,]$/, '');
        if (email) {
            this.addEmailBlock(listType, email);
            inputObj.value = '';
            this.requestUpdate();
        }
    }

    handleAttendeePaste(e, listType) {
        e.preventDefault();
        const pasteData = (e.clipboardData || window.clipboardData).getData('text');
        if (!pasteData) return;
        this.addEmailBlock(listType, pasteData);
        this.requestUpdate();
    }

    hideCcRow() {
        this.showCc = false;
        this.ccAttendees = [];
        this.requestUpdate();
    }
    
    hideBccRow() {
        this.showBcc = false;
        this.bccAttendees = [];
        this.requestUpdate();
    }
    
    toggleCcBcc() {
        if (!this.showCc) this.showCc = true;
        if (!this.showBcc) this.showBcc = true;
        this.requestUpdate();
    }

    downloadSampleCsv() {
        const csvContent = "email\nexample1@test.com\nexample2@test.com\nexample3@test.com";
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "sample_contacts.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    removeAttendee(index, listType) {
        if (listType === 'to') this.attendees = this.attendees.filter((_, i) => i !== index);
        if (listType === 'cc') this.ccAttendees = this.ccAttendees.filter((_, i) => i !== index);
        if (listType === 'bcc') this.bccAttendees = this.bccAttendees.filter((_, i) => i !== index);
    }
    
    startEditAttendee(index, listType) {
        this.editingAttendee = { list: listType, index };
        this.requestUpdate();
        setTimeout(() => {
            const input = this.shadowRoot.querySelector('.edit-attendee-input');
            if (input) { input.focus(); input.select(); }
        }, 50);
    }
    
    saveEditAttendee(e, index, listType) {
        if (e.key && e.key !== 'Enter') return;
        const val = e.target.value.trim();
        let list = listType === 'to' ? this.attendees : (listType === 'cc' ? this.ccAttendees : this.bccAttendees);
        
        if (!val) {
            this.removeAttendee(index, listType);
        } else {
            list[index] = val;
        }
        
        if (listType === 'to') this.attendees = [...this.attendees];
        if (listType === 'cc') this.ccAttendees = [...this.ccAttendees];
        if (listType === 'bcc') this.bccAttendees = [...this.bccAttendees];
        
        this.editingAttendee = null;
        this.requestUpdate();
    }

    triggerCsvImport() {
        this.shadowRoot.getElementById('csv-import').click();
    }
    
    handleCsvImport(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            const text = ev.target.result;
            const emails = text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi) || [];
            this.attendees = [...new Set([...this.attendees, ...emails])];
            this.showToast(`Imported ${emails.length} emails from CSV`, 'success');
        };
        reader.readAsText(file);
        e.target.value = '';
    }

    triggerAttachment() {
        this.shadowRoot.getElementById('file-attachment').click();
    }
    
    handleAttachment(e) {
        const files = Array.from(e.target.files);
        if (files.length) {
            this.attachments = [...this.attachments, ...files];
            this.requestUpdate();
        }
        e.target.value = '';
    }
    
    removeAttachment(index) {
        this.attachments = this.attachments.filter((_, i) => i !== index);
    }



    
    toggleFormatPainter() {
        if (this.isFormatPainting) {
            this.editMeeting = null;
        this.isFormatPainting = false;
            this.copiedFormat = null;
            this.requestUpdate();
            return;
        }
        
        const selection = window.getSelection();
        if (!selection.rangeCount) return;
        
        const parent = selection.anchorNode.nodeType === 3 ? selection.anchorNode.parentElement : selection.anchorNode;
        const styles = window.getComputedStyle(parent);
        
        this.copiedFormat = {
            fontWeight: styles.fontWeight,
            fontStyle: styles.fontStyle,
            textDecoration: styles.textDecoration,
            color: styles.color,
            backgroundColor: styles.backgroundColor,
            fontFamily: styles.fontFamily,
            fontSize: styles.fontSize
        };
        
        this.isFormatPainting = true;
        this.requestUpdate();
        this.showToast('Format copied! Select text to apply', 'success');
    }

    applyFormatPainter(e) {
        if (!this.isFormatPainting || !this.copiedFormat) return;
        
        const selection = window.getSelection();
        if (!selection.isCollapsed && selection.rangeCount > 0) {
            const cf = this.copiedFormat;
            const editor = this.shadowRoot.querySelector('#description-editor') || this.shadowRoot.querySelector('.full-note-editor');
            if (editor) editor.focus();
            
            if (cf.fontWeight === 'bold' || parseInt(cf.fontWeight) >= 600) document.execCommand('bold');
            if (cf.fontStyle === 'italic') document.execCommand('italic');
            if (cf.textDecoration.includes('underline')) document.execCommand('underline');
            if (cf.textDecoration.includes('line-through')) document.execCommand('strikeThrough');
            if (cf.color && cf.color !== 'rgba(0, 0, 0, 0)' && cf.color !== 'rgb(0, 0, 0)') document.execCommand('foreColor', false, cf.color);
            if (cf.backgroundColor && cf.backgroundColor !== 'rgba(0, 0, 0, 0)' && cf.backgroundColor !== 'transparent') document.execCommand('hiliteColor', false, cf.backgroundColor);
            if (cf.fontFamily) document.execCommand('fontName', false, cf.fontFamily);
            
            this.editMeeting = null;
        this.isFormatPainting = false;
            this.copiedFormat = null;
            this.requestUpdate();
            this.showToast('Format applied!', 'success');
        }
    }

    formatDesc(command, value = null) {
        const editor = this.shadowRoot.querySelector('#description-editor');
        if (editor) editor.focus();
        document.execCommand(command, false, value);
        
    }

    _handleDescPaste(e) {
        e.preventDefault();
        const clipboardData = e.clipboardData || window.clipboardData;
        const htmlData = clipboardData.getData('text/html');
        const textData = clipboardData.getData('text/plain');

        if (clipboardData.files && clipboardData.files.length > 0) {
            const file = clipboardData.files[0];
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const base64Data = event.target.result;
                    const imgTag = `<img src="${base64Data}" alt="Pasted Image"/>`;
                    document.execCommand('insertHTML', false, imgTag);
                    const editor = this.shadowRoot.querySelector('#description-editor');
                    
                };
                reader.readAsDataURL(file);
                return;
            }
        }

        if (htmlData) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = htmlData;
            const safeHtml = tempDiv.innerHTML.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
            document.execCommand('insertHTML', false, safeHtml);
        } else if (textData) {
            const formattedText = textData.replace(/\r?\n/g, '<br>');
            document.execCommand('insertHTML', false, formattedText);
        }
        const editor = this.shadowRoot.querySelector('#description-editor');
        
    }

        async saveMeeting() {
        if (!this.title) {
            this.showToast('Meeting title is required', 'error');
            return;
        }
        
        try {
            const { ipcRenderer } = window.require('electron');
            const prefsStr = await ipcRenderer.invoke('storage:get-preferences');
            let dnsIP = '127.0.0.1'; let dnsPort = '8000';
            if(prefsStr) {
                 let prefs = typeof prefsStr === 'string' ? JSON.parse(prefsStr) : prefsStr;
                 if (prefs && prefs.data) prefs = prefs.data;
                 if (prefs.dnsIP) dnsIP = prefs.dnsIP;
            }
            
            const baseUrl = dnsIP.includes('.loca.lt') ? `https://${dnsIP}/api/meetings` : `http://${dnsIP}:${dnsPort}/api/meetings`;
            const endpointUrl = this.editMeeting ? `${baseUrl}/${this.editMeeting.id}` : baseUrl + '/';
            const reqMethod = this.editMeeting ? 'PUT' : 'POST';
            const formData = new FormData();
            
            const meetingData = {
                title: this.title,
                description: "",
                start_time: new Date(`${this.startDate}T${this.startTime}:00Z`).toISOString(),
                end_time: new Date(`${this.endDate}T${this.endTime}:00Z`).toISOString(),
                timezone: this.timezone,
                recurrence: this.recurrence,
                participants: [],
                cc_participants: [],
                bcc_participants: [],
                invite_url_base: dnsIP.includes('.loca.lt') ? `https://${dnsIP}/invite/index.html` : `http://${dnsIP}:${dnsPort}/invite/index.html`
            };
            
            const meetingDataJson = JSON.stringify(meetingData);
            formData.append('meeting_data', meetingDataJson);
            
            this.showToast("Generating Meeting...", "success");
            const tokenResponse = await ipcRenderer.invoke('storage:get-credentials');
            let token = "";
            if (tokenResponse) {
                let creds = typeof tokenResponse === 'string' ? JSON.parse(tokenResponse) : tokenResponse;
                if (creds && creds.data) creds = creds.data;
                token = creds.jwtToken || "";
            }

            let response;
            if (this.editMeeting) {
                response = await fetch(endpointUrl, {
                    method: 'PUT',
                    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                    body: meetingDataJson || JSON.stringify(meetingData)
                });
            } else {
                response = await fetch(endpointUrl, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: formData
                });
            }
            
            if (response.ok) {
                const data = await response.json();
                this.createdMeeting = Array.isArray(data) ? data[0] : data;
                this.step = 'share';
                this.showToast("Meeting Generated Successfully!", "success");
                this.requestUpdate();
            } else {
                this.showToast("Failed to schedule meeting", "error");
            }
        } catch(err) {
            console.error(err);
            this.showToast("Error saving meeting: " + err.message, "error");
        }
    }


    
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
        
        return `📅 You are invited to a HideWIN Meeting!

Topic: ${title}
Time: ${time}

🔗 Join Meeting:
${joinLink}

Meeting ID: ${this.createdMeeting.id}
Passcode: ${passcode}`;
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
                 let prefs = typeof prefsStr === 'string' ? JSON.parse(prefsStr) : prefsStr;
                 if (prefs && prefs.data) prefs = prefs.data;
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
                let creds = typeof tokenResponse === 'string' ? JSON.parse(tokenResponse) : tokenResponse;
                if (creds && creds.data) creds = creds.data;
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
                        <h2 class="header-title" style="font-size:22px;font-weight:600;margin-left:16px;">${this.editMeeting ? 'Edit Meeting' : 'Schedule Meeting'}</h2>
                    </div>
                    <div class="header-actions">
                        <button class="btn" @click=${() => this.dispatchEvent(new CustomEvent('close-meeting', { bubbles: true, composed: true }))}>Cancel</button>
                        <button class="btn btn-primary" style="font-weight:600;padding:8px 24px" @click=${this.saveMeeting}>${this.editMeeting ? 'Update Meeting' : 'Generate'}</button>
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
                                    <span style="font-size:13px; font-weight:600; color:#6b7280; margin-right:8px; min-width:30px">To:</span>
                                    ${this.attendees.map((email, i) => html`
                                        <div class="attendee-chip" style="background:#e5e7eb; padding:4px 10px; border-radius:16px; font-size:13px; display:flex; align-items:center; gap:6px">
                                            ${email} <span style="cursor:pointer; font-weight:bold" @click=${()=>this.removeAttendee(i, 'to')}>&times;</span>
                                        </div>
                                    `)}
                                    <input type="text" class="attendee-input" style="border:none; outline:none; flex:1; min-width:150px; background:transparent" placeholder="Required attendees..." @keydown=${e=>this.handleAttendeeKeyDown(e, 'to', e.target)} @blur=${e=>this.handleAttendeeBlur(e, 'to', e.target)} @paste=${e=>this.handleAttendeePaste(e, 'to')}>
                                </div>
                                <div class="input-field attendees-container" style="padding:8px; display:flex; flex-wrap:wrap; gap:6px; min-height:44px; align-items:center">
                                    <span style="font-size:13px; font-weight:600; color:#6b7280; margin-right:8px; min-width:30px">Cc:</span>
                                    ${this.ccAttendees.map((email, i) => html`
                                        <div class="attendee-chip" style="background:#e5e7eb; padding:4px 10px; border-radius:16px; font-size:13px; display:flex; align-items:center; gap:6px">
                                            ${email} <span style="cursor:pointer; font-weight:bold" @click=${()=>this.removeAttendee(i, 'cc')}>&times;</span>
                                        </div>
                                    `)}
                                    <input type="text" class="attendee-input" style="border:none; outline:none; flex:1; min-width:150px; background:transparent" placeholder="Optional Cc..." @keydown=${e=>this.handleAttendeeKeyDown(e, 'cc', e.target)} @blur=${e=>this.handleAttendeeBlur(e, 'cc', e.target)} @paste=${e=>this.handleAttendeePaste(e, 'cc')}>
                                </div>
                                <div class="input-field attendees-container" style="padding:8px; display:flex; flex-wrap:wrap; gap:6px; min-height:44px; align-items:center">
                                    <span style="font-size:13px; font-weight:600; color:#6b7280; margin-right:8px; min-width:30px">Bcc:</span>
                                    ${this.bccAttendees.map((email, i) => html`
                                        <div class="attendee-chip" style="background:#e5e7eb; padding:4px 10px; border-radius:16px; font-size:13px; display:flex; align-items:center; gap:6px">
                                            ${email} <span style="cursor:pointer; font-weight:bold" @click=${()=>this.removeAttendee(i, 'bcc')}>&times;</span>
                                        </div>
                                    `)}
                                    <input type="text" class="attendee-input" style="border:none; outline:none; flex:1; min-width:150px; background:transparent" placeholder="Optional Bcc..." @keydown=${e=>this.handleAttendeeKeyDown(e, 'bcc', e.target)} @blur=${e=>this.handleAttendeeBlur(e, 'bcc', e.target)} @paste=${e=>this.handleAttendeePaste(e, 'bcc')}>
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

}
customElements.define('schedule-meeting-view', ScheduleMeetingView);
