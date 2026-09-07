import re
with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\ScheduleMeetingView.js', 'r', encoding='utf-8') as f:
    content = f.read()

cc_bcc_html = """
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
"""

content = re.sub(
    r'<div style="display:flex; flex-direction:column; gap:12px; margin-bottom:24px">.*?</div>\s*</div>\s*<!-- Toolbar and Editor -->',
    cc_bcc_html + '<!-- Toolbar and Editor -->',
    content,
    flags=re.DOTALL
)

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\ScheduleMeetingView.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated Phase 4 HTML logic")
