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

const configManager = window.require ? window.require('./utils/configManager.js') : require('../../utils/configManager.js');

export class ScheduleMeetingView extends LitElement {
    static properties = {
        editMeeting: { type: Object },
        isFormatPainting: { type: Boolean },
        copiedFormat: { type: Object },
        title: { type: String },

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
            const tokenResponse = await ipcRenderer.invoke('storage:get-credentials');
            let credentials = typeof tokenResponse === 'string' ? JSON.parse(tokenResponse) : tokenResponse;
            credentials = credentials?.data || credentials || {};

            const baseUrl = `${configManager.getApiBaseUrl()}/api/meetings`;
            const endpointUrl = this.editMeeting ? `${baseUrl}/${this.editMeeting.id}` : `${baseUrl}/`;
            const meetingData = {
                title: this.title,
                description: '',
                start_time: new Date(`${this.startDate}T${this.startTime}:00Z`).toISOString(),
                end_time: new Date(`${this.endDate}T${this.endTime}:00Z`).toISOString(),
                timezone: this.timezone,
                recurrence: this.recurrence
            };
            const response = await fetch(endpointUrl, {
                method: this.editMeeting ? 'PUT' : 'POST',
                headers: {
                    'Authorization': `Bearer ${credentials.jwtToken || ''}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(meetingData)
            });
            if (!response.ok) throw new Error('Failed to save meeting.');
            this.dispatchEvent(new CustomEvent('close-meeting', { bubbles: true, composed: true }));
        } catch (err) {
            console.error(err);
            this.showToast(`Error saving meeting: ${err.message}`, 'error');
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

    render() {
        return this.renderCreateStep();
    }

}
customElements.define('schedule-meeting-view', ScheduleMeetingView);
