import re
path = r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\ScheduleMeetingView.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Email inputs: keydown triggers and paste handler
methods = """
    handleAttendeeKeyDown(e, listType, inputObj) {
        if (e.key === 'Enter' || e.key === ',' || e.key === ';') {
            e.preventDefault();
            const email = inputObj.value.trim();
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
        
        // Split by semicolons, commas, or whitespace, and filter out empty
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
    }
"""

content = re.sub(r'\s*handleAttendeeKeyDown.*?\}\s*\}', methods, content, flags=re.DOTALL)

# Let's fix the properties to showCc and showBcc instead of just showCcBcc
content = content.replace("showCcBcc: { type: Boolean },", "showCc: { type: Boolean }, showBcc: { type: Boolean },")
content = content.replace("this.showCcBcc = false;", "this.showCc = false; this.showBcc = false;")

# Also need to re-add the rest of the methods (removeAttendee, startEditAttendee, etc.) that might have been overwritten if the regex was greedy
