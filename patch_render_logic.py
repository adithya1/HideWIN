import re
path = r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\ScheduleMeetingView.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix CC/BCC Toggle button rendering
old_toggle = """${!this.showCcBcc ? html`<button class="cc-bcc-btn" @click=${() => this.showCcBcc = true}>Cc / Bcc</button>` : ''}"""
new_toggle = """${(!this.showCc || !this.showBcc) ? html`<button class="cc-bcc-btn" @click=${() => this.toggleCcBcc()}>Cc / Bcc</button>` : ''}"""
content = content.replace(old_toggle, new_toggle)

# Fix .CSV Link rendering
old_csv = """                            <button class="cc-bcc-btn" title="Import CSV" @click=${() => this.triggerCsvImport()}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                            </button>"""
new_csv = """                            <button class="cc-bcc-btn" title="Import CSV" @click=${() => this.triggerCsvImport()} style="display:flex;align-items:center;gap:4px">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                                <span>Import</span>
                            </button>
                            <span class="cc-bcc-btn" title="Download sample CSV format" @click=${() => this.downloadSampleCsv()} style="font-size:10px; margin-left:0; font-weight:bold; align-self:center;">(.CSV)</span>"""
content = content.replace(old_csv, new_csv)

# Fix Inputs to add paste, semicolons, and clear buttons
# For "To":
content = content.replace("${email} <span style=\"cursor:pointer;font-weight:bold;margin-left:4px\" @click=${(e) => { e.stopPropagation(); this.removeAttendee(i, 'to'); }}>x</span>", "${email}<span style=\"color:var(--text-secondary)\">;</span> <span style=\"cursor:pointer;font-weight:bold;margin-left:4px\" @click=${(e) => { e.stopPropagation(); this.removeAttendee(i, 'to'); }}>x</span>")
content = content.replace("class=\"attendee-input to-input\"", "class=\"attendee-input to-input\" @paste=${(e) => this.handleAttendeePaste(e, 'to')}")

# For CC/BCC rendering, we must replace the entire block since we need separate conditionals for showCc and showBcc.
old_cc_bcc = """                            ${this.showCcBcc ? html`
                                <div class="input-field attendees-container" style="padding:4px; margin-top:4px;">
                                    <span style="font-size:12px;color:#605e5c;margin-right:4px;">Cc:</span>
                                    ${this.ccAttendees.map((email, i) => html`
                                        <div class="attendee-chip" @dblclick=${() => this.startEditAttendee(i, 'cc')}>
                                            ${this.editingAttendee?.list === 'cc' && this.editingAttendee?.index === i ? html`
                                                <input type="text" class="edit-attendee-input" .value=${email} @blur=${(e) => this.saveEditAttendee(e, i, 'cc')} @keydown=${(e) => this.saveEditAttendee(e, i, 'cc')}>
                                            ` : html`
                                                ${email} <span style="cursor:pointer;font-weight:bold;margin-left:4px" @click=${(e) => { e.stopPropagation(); this.removeAttendee(i, 'cc'); }}>x</span>
                                            `}
                                        </div>
                                    `)}
                                    <input type="text" class="attendee-input cc-input" placeholder="Optional" @keydown=${(e) => this.handleAttendeeKeyDown(e, 'cc', e.target)}>
                                </div>
                                <div class="input-field attendees-container" style="padding:4px; margin-top:4px;">
                                    <span style="font-size:12px;color:#605e5c;margin-right:4px;">Bcc:</span>
                                    ${this.bccAttendees.map((email, i) => html`
                                        <div class="attendee-chip" @dblclick=${() => this.startEditAttendee(i, 'bcc')}>
                                            ${this.editingAttendee?.list === 'bcc' && this.editingAttendee?.index === i ? html`
                                                <input type="text" class="edit-attendee-input" .value=${email} @blur=${(e) => this.saveEditAttendee(e, i, 'bcc')} @keydown=${(e) => this.saveEditAttendee(e, i, 'bcc')}>
                                            ` : html`
                                                ${email} <span style="cursor:pointer;font-weight:bold;margin-left:4px" @click=${(e) => { e.stopPropagation(); this.removeAttendee(i, 'bcc'); }}>x</span>
                                            `}
                                        </div>
                                    `)}
                                    <input type="text" class="attendee-input bcc-input" placeholder="Optional" @keydown=${(e) => this.handleAttendeeKeyDown(e, 'bcc', e.target)}>
                                </div>
                            ` : ''}"""

new_cc_bcc = """                            ${this.showCc ? html`
                                <div class="input-field attendees-container" style="padding:4px; margin-top:4px;">
                                    <span style="font-size:12px;color:#605e5c;margin-right:4px;">Cc:</span>
                                    ${this.ccAttendees.map((email, i) => html`
                                        <div class="attendee-chip" @dblclick=${() => this.startEditAttendee(i, 'cc')}>
                                            ${this.editingAttendee?.list === 'cc' && this.editingAttendee?.index === i ? html`
                                                <input type="text" class="edit-attendee-input" .value=${email} @blur=${(e) => this.saveEditAttendee(e, i, 'cc')} @keydown=${(e) => this.saveEditAttendee(e, i, 'cc')}>
                                            ` : html`
                                                ${email}<span style="color:var(--text-secondary)">;</span> <span style="cursor:pointer;font-weight:bold;margin-left:4px" @click=${(e) => { e.stopPropagation(); this.removeAttendee(i, 'cc'); }}>x</span>
                                            `}
                                        </div>
                                    `)}
                                    <input type="text" class="attendee-input cc-input" placeholder="Optional" @paste=${(e) => this.handleAttendeePaste(e, 'cc')} @keydown=${(e) => this.handleAttendeeKeyDown(e, 'cc', e.target)}>
                                    <span style="cursor:pointer;color:#a19f9d;font-weight:bold;margin-left:auto;margin-right:8px;" title="Remove Cc" @click=${() => this.hideCcRow()}>✕</span>
                                </div>
                            ` : ''}
                            ${this.showBcc ? html`
                                <div class="input-field attendees-container" style="padding:4px; margin-top:4px;">
                                    <span style="font-size:12px;color:#605e5c;margin-right:4px;">Bcc:</span>
                                    ${this.bccAttendees.map((email, i) => html`
                                        <div class="attendee-chip" @dblclick=${() => this.startEditAttendee(i, 'bcc')}>
                                            ${this.editingAttendee?.list === 'bcc' && this.editingAttendee?.index === i ? html`
                                                <input type="text" class="edit-attendee-input" .value=${email} @blur=${(e) => this.saveEditAttendee(e, i, 'bcc')} @keydown=${(e) => this.saveEditAttendee(e, i, 'bcc')}>
                                            ` : html`
                                                ${email}<span style="color:var(--text-secondary)">;</span> <span style="cursor:pointer;font-weight:bold;margin-left:4px" @click=${(e) => { e.stopPropagation(); this.removeAttendee(i, 'bcc'); }}>x</span>
                                            `}
                                        </div>
                                    `)}
                                    <input type="text" class="attendee-input bcc-input" placeholder="Optional" @paste=${(e) => this.handleAttendeePaste(e, 'bcc')} @keydown=${(e) => this.handleAttendeeKeyDown(e, 'bcc', e.target)}>
                                    <span style="cursor:pointer;color:#a19f9d;font-weight:bold;margin-left:auto;margin-right:8px;" title="Remove Bcc" @click=${() => this.hideBccRow()}>✕</span>
                                </div>
                            ` : ''}"""

# Since the previous code actually had showCcBcc, but we replaced it with showCc and showBcc in properties, wait, the HTML still had showCcBcc!
# I will use a regex to replace that block.
content = re.sub(r'\$\{this\.showCcBcc \? html`.*?` : \'\'\}', new_cc_bcc.replace("\\", "\\\\"), content, flags=re.DOTALL)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
