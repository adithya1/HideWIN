import re
path = r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\ScheduleMeetingView.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Properties
props = """
        attendees: { type: Array },
        ccAttendees: { type: Array },
        bccAttendees: { type: Array },
        showCcBcc: { type: Boolean },
        attachments: { type: Array },
        editingAttendee: { type: Object },
"""
content = re.sub(r'\s*attendees:\s*\{\s*type:\s*Array\s*\},', props, content)

init = """
        this.attendees = [];
        this.ccAttendees = [];
        this.bccAttendees = [];
        this.showCcBcc = false;
        this.attachments = [];
        this.editingAttendee = null; // { list: 'to'|'cc'|'bcc', index: number }
"""
content = re.sub(r'\s*this\.attendees\s*=\s*\[\];', init, content)

# 2. Styles
styles = """
            .attendee-chip {
                background: rgba(37, 99, 235, 0.1);
                color: var(--accent);
                padding: 2px 8px;
                border-radius: 16px;
                font-size: 12px;
                display: flex;
                align-items: center;
                gap: 4px;
                user-select: none;
            }
            .attendee-chip input {
                border: none;
                background: transparent;
                outline: none;
                color: var(--accent);
                font-size: 12px;
                width: 100px;
            }
            .cc-bcc-btn {
                background: transparent;
                border: none;
                color: #605e5c;
                cursor: pointer;
                font-size: 13px;
                font-weight: 600;
                margin-left: 8px;
            }
            .cc-bcc-btn:hover {
                text-decoration: underline;
                color: var(--accent);
            }
            .attachment-pill {
                display: flex;
                align-items: center;
                gap: 6px;
                background: #f3f2f1;
                padding: 4px 10px;
                border-radius: 16px;
                font-size: 12px;
                border: 1px solid #e1dfdd;
            }
"""
content = re.sub(r'\s*\.attendee-chip\s*\{[^}]*\}', styles, content)

# 3. Methods
methods = """
    handleAttendeeKeyDown(e, listType, inputObj) {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const email = inputObj.value.trim();
            if (email && email.includes('@')) {
                if (listType === 'to') this.attendees = [...this.attendees, email];
                if (listType === 'cc') this.ccAttendees = [...this.ccAttendees, email];
                if (listType === 'bcc') this.bccAttendees = [...this.bccAttendees, email];
                inputObj.value = '';
                this.requestUpdate();
            }
        }
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
"""

content = re.sub(r'\s*handleAttendeeKeyDown.*?removeAttendee[^}]*\}', methods, content, flags=re.DOTALL)

# 4. Save logic update
save_logic = """
            const formData = new FormData();
            
            const meetingData = {
                title: this.title,
                description: this.description,
                start_time: new Date(`${this.startDate}T${this.startTime}:00Z`).toISOString(),
                end_time: new Date(`${this.endDate}T${this.endTime}:00Z`).toISOString(),
                timezone: this.timezone,
                recurrence: this.recurrence,
                participants: this.attendees,
                cc_participants: this.ccAttendees,
                bcc_participants: this.bccAttendees,
                invite_url_base: dnsIP.includes('.loca.lt') ? `https://${dnsIP}/invite/index.html` : `http://${dnsIP}:${dnsPort}/invite/index.html`
            };
            
            formData.append('meeting_data', JSON.stringify(meetingData));
            this.attachments.forEach(file => {
                formData.append('files', file);
            });
            
            this.showToast("Saving meeting...", "success");
            const tokenResponse = await ipcRenderer.invoke('storage:get-credentials');
            let token = "";
            if (tokenResponse) {
                const creds = JSON.parse(tokenResponse);
                token = creds.jwtToken || "";
            }

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });
"""
content = re.sub(r'\s*const payload = \{.*?body: JSON\.stringify\(payload\)\s*\}\);', save_logic, content, flags=re.DOTALL)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
