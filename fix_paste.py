import re
path = r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\ScheduleMeetingView.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix truncated handleAttendeePaste
old_paste = """    handleAttendeePaste(e, listType) {
        e.preventDefault();
        const pasteData = (e.clipboardData || window.clipboardData).getData('text');
        if (!pasteData) return;
    }"""

new_paste = """    handleAttendeePaste(e, listType) {
        e.preventDefault();
        const pasteData = (e.clipboardData || window.clipboardData).getData('text');
        if (!pasteData) return;
        // Split by semicolons, commas, newlines, tabs
        const emails = pasteData.split(/[;,\\n\\t]+/).map(s => s.trim().replace(/[<>]/g, '')).filter(Boolean);
        if (emails.length > 0) {
            if (listType === 'to') this.attendees = [...new Set([...this.attendees, ...emails])];
            if (listType === 'cc') this.ccAttendees = [...new Set([...this.ccAttendees, ...emails])];
            if (listType === 'bcc') this.bccAttendees = [...new Set([...this.bccAttendees, ...emails])];
            this.requestUpdate();
        }
    }"""

content = content.replace(old_paste, new_paste)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
