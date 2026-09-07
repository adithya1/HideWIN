with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\ScheduleMeetingView.js', 'r', encoding='utf-8') as f:
    content = f.read()

new_keydown = """
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
        const emails = text.split(/[\\s;,]+/).map(s => s.trim()).filter(Boolean);
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

    hideCcRow() {"""

import re
match = re.search(r'handleAttendeeKeyDown\(e, listType, inputObj\) \{.*?(?=hideCcRow\(\) \{)', content, flags=re.DOTALL)
if match:
    content = content[:match.start()] + new_keydown + content[match.end():]
else:
    print("Could not find the block to replace!")

content = content.replace(
    "@keydown=${(e) => this.handleAttendeeKeyDown(e, 'to', e.target)}>",
    "@keydown=${(e) => this.handleAttendeeKeyDown(e, 'to', e.target)} @blur=${(e) => this.handleAttendeeBlur(e, 'to', e.target)}>"
)
content = content.replace(
    "@keydown=${(e) => this.handleAttendeeKeyDown(e, 'cc', e.target)}>",
    "@keydown=${(e) => this.handleAttendeeKeyDown(e, 'cc', e.target)} @blur=${(e) => this.handleAttendeeBlur(e, 'cc', e.target)}>"
)
content = content.replace(
    "@keydown=${(e) => this.handleAttendeeKeyDown(e, 'bcc', e.target)}>",
    "@keydown=${(e) => this.handleAttendeeKeyDown(e, 'bcc', e.target)} @blur=${(e) => this.handleAttendeeBlur(e, 'bcc', e.target)}>"
)

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\ScheduleMeetingView.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated ScheduleMeetingView.js successfully")
