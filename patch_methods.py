import re
path = r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\ScheduleMeetingView.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace showCcBcc with showCc and showBcc
content = content.replace("showCcBcc: { type: Boolean },", "showCc: { type: Boolean },\n        showBcc: { type: Boolean },")
content = content.replace("this.showCcBcc = false;", "this.showCc = false;\n        this.showBcc = false;")

# Replace handleAttendeeKeyDown
old_method = """    handleAttendeeKeyDown(e, listType, inputObj) {
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
    }"""

new_methods = """    handleAttendeeKeyDown(e, listType, inputObj) {
        if (e.key === 'Enter' || e.key === ',' || e.key === ';') {
            e.preventDefault();
            const email = inputObj.value.trim().replace(/[;,]$/, '');
            if (email) {
                if (listType === 'to') this.attendees = [...this.attendees, email];
                if (listType === 'cc') this.ccAttendees = [...this.ccAttendees, email];
                if (listType === 'bcc') this.bccAttendees = [...this.bccAttendees, email];
                inputObj.value = '';
                this.requestUpdate();
            }
        }
    }

    handleAttendeePaste(e, listType) {
        e.preventDefault();
        const pasteData = (e.clipboardData || window.clipboardData).getData('text');
        if (!pasteData) return;
        const emails = pasteData.split(/[;,]+/).map(s => s.trim()).filter(Boolean);
        if (emails.length > 0) {
            if (listType === 'to') this.attendees = [...this.attendees, ...emails];
            if (listType === 'cc') this.ccAttendees = [...this.ccAttendees, ...emails];
            if (listType === 'bcc') this.bccAttendees = [...this.bccAttendees, ...emails];
            this.requestUpdate();
        }
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
        const csvContent = "email\\nexample1@test.com\\nexample2@test.com\\nexample3@test.com";
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "sample_contacts.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }"""

content = content.replace(old_method, new_methods)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
