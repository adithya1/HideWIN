with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\ScheduleMeetingView.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add editMeeting to properties
content = content.replace("isFormatPainting: { type: Boolean },", "editMeeting: { type: Object },\n        isFormatPainting: { type: Boolean },")

# 2. In constructor, add editMeeting = null
content = content.replace("this.isFormatPainting = false;", "this.editMeeting = null;\n        this.isFormatPainting = false;")

# 3. Modify updated() or firstUpdated() to load editMeeting
load_logic = """
    updated(changedProps) {
        super.updated(changedProps);
        if (changedProps.has('editMeeting') && this.editMeeting) {
            this.title = this.editMeeting.title || '';
            this.description = this.editMeeting.description || '';
            if (this.editMeeting.start_time) {
                const d = new Date(this.editMeeting.start_time);
                this.startDate = d.toISOString().split('T')[0];
                this.startTime = d.toTimeString().substring(0,5);
            }
            if (this.editMeeting.end_time) {
                const d = new Date(this.editMeeting.end_time);
                this.endDate = d.toISOString().split('T')[0];
                this.endTime = d.toTimeString().substring(0,5);
            }
            this.timezone = this.editMeeting.timezone || this.timezone;
            this.recurrence = this.editMeeting.recurrence || 'none';
            if (this.editMeeting.recurrence && this.editMeeting.recurrence !== 'none') {
                this.recurrence = this.editMeeting.recurrence;
            }
        }
    }
"""
if "updated(changedProps)" not in content:
    content = content.replace("firstUpdated() {", load_logic + "\n    firstUpdated() {")

# 4. Modify UI to change Generate to Update
content = content.replace("@click=${this.saveMeeting}>Generate</button>", "@click=${this.saveMeeting}>${this.editMeeting ? 'Update Meeting' : 'Generate'}</button>")
content = content.replace("<h2 class=\"header-title\" style=\"font-size:22px;font-weight:600;margin-left:16px;\">Schedule Meeting</h2>", "<h2 class=\"header-title\" style=\"font-size:22px;font-weight:600;margin-left:16px;\">${this.editMeeting ? 'Edit Meeting' : 'Schedule Meeting'}</h2>")

# 5. Modify saveMeeting to call PUT if this.editMeeting
save_logic = """
            const meetingData = {
                title: this.title,
                description: descHtml,
                start_time: (this.startDate && this.startTime) ? `${this.startDate}T${this.startTime}:00Z` : null,
                end_time: (this.endDate && this.endTime) ? `${this.endDate}T${this.endTime}:00Z` : null,
                timezone: this.timezone,
                recurrence: this.recurrence,
                participants: this.attendees,
                cc_participants: this.ccAttendees,
                bcc_participants: this.bccAttendees,
                invite_url_base: `${protocol}://${cloudHost}/invite/index.html`
            };

            const method = this.editMeeting ? 'PUT' : 'POST';
            const endpoint = this.editMeeting ? `/api/meetings/${this.editMeeting.id}` : `/api/meetings/schedule`;

            const res = await fetch(`${protocol}://${cloudHost}${endpoint}`, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(meetingData)
            });
"""
# Replace the original fetch call in saveMeeting
import re
pattern = r"const res = await fetch\(`\$\{protocol\}://\$\{cloudHost\}/api/meetings/schedule`, \{\s*method: 'POST',\s*headers: \{\s*'Authorization': `Bearer \$\{token\}`\s*\},\s*body: formData\s*\}\);"

# Oh wait, the original uses formData!
old_save_logic = """
            const formData = new FormData();
            formData.append('meeting_data', JSON.stringify({
                title: this.title,
                description: descHtml,
                start_time: (this.startDate && this.startTime) ? `${this.startDate}T${this.startTime}:00Z` : null,
                end_time: (this.endDate && this.endTime) ? `${this.endDate}T${this.endTime}:00Z` : null,
                timezone: this.timezone,
                recurrence: this.recurrence,
                participants: this.attendees,
                cc_participants: this.ccAttendees,
                bcc_participants: this.bccAttendees,
                invite_url_base: `${protocol}://${cloudHost}/invite/index.html`
            }));
            
            this.attachments.forEach(file => {
                formData.append('files', file);
            });

            const res = await fetch(`${protocol}://${cloudHost}/api/meetings/schedule`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });
"""

new_save_logic = """
            const meetingDataJson = JSON.stringify({
                title: this.title,
                description: descHtml,
                start_time: (this.startDate && this.startTime) ? `${this.startDate}T${this.startTime}:00Z` : null,
                end_time: (this.endDate && this.endTime) ? `${this.endDate}T${this.endTime}:00Z` : null,
                timezone: this.timezone,
                recurrence: this.recurrence,
                participants: this.attendees,
                cc_participants: this.ccAttendees,
                bcc_participants: this.bccAttendees,
                invite_url_base: `${protocol}://${cloudHost}/invite/index.html`
            });

            const method = this.editMeeting ? 'PUT' : 'POST';
            const endpoint = this.editMeeting ? `/api/meetings/${this.editMeeting.id}` : `/api/meetings/schedule`;

            let res;
            if (this.editMeeting) {
                // PUT doesn't support attachments in our endpoint yet, just send JSON
                res = await fetch(`${protocol}://${cloudHost}${endpoint}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: meetingDataJson
                });
            } else {
                const formData = new FormData();
                formData.append('meeting_data', meetingDataJson);
                this.attachments.forEach(file => {
                    formData.append('files', file);
                });
                res = await fetch(`${protocol}://${cloudHost}${endpoint}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                });
            }
"""

content = content.replace(old_save_logic.strip(), new_save_logic.strip())

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\ScheduleMeetingView.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Patched ScheduleMeetingView.js")
