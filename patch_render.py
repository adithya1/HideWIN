import re
path = r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\ScheduleMeetingView.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Render logic
render_html = """
                    <div class="form-row">
                        <div class="row-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg></div>
                        <div style="flex:1; display:flex; flex-direction:column; gap:4px">
                            <div class="input-field attendees-container" style="padding:4px; flex:1">
                                ${this.attendees.map((email, i) => html`
                                    <div class="attendee-chip" @dblclick=${() => this.startEditAttendee(i, 'to')}>
                                        ${this.editingAttendee?.list === 'to' && this.editingAttendee?.index === i ? html`
                                            <input type="text" class="edit-attendee-input" .value=${email} @blur=${(e) => this.saveEditAttendee(e, i, 'to')} @keydown=${(e) => this.saveEditAttendee(e, i, 'to')}>
                                        ` : html`
                                            ${email} <span style="cursor:pointer;font-weight:bold;margin-left:4px" @click=${(e) => { e.stopPropagation(); this.removeAttendee(i, 'to'); }}>x</span>
                                        `}
                                    </div>
                                `)}
                                <input type="text" class="attendee-input to-input" placeholder="Add required attendees" 
                                    @keydown=${(e) => this.handleAttendeeKeyDown(e, 'to', e.target)}>
                            </div>
                            ${this.showCcBcc ? html`
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
                            ` : ''}
                        </div>
                        <div style="display:flex; align-items:flex-start; padding-top:8px;">
                            ${!this.showCcBcc ? html`<button class="cc-bcc-btn" @click=${() => this.showCcBcc = true}>Cc / Bcc</button>` : ''}
                            <button class="cc-bcc-btn" title="Import CSV" @click=${() => this.triggerCsvImport()}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                            </button>
                            <input type="file" id="csv-import" accept=".csv" style="display:none" @change=${this.handleCsvImport}>
                        </div>
                    </div>
"""

content = re.sub(r'<div class="form-row">\s*<div class="row-icon"><svg[^>]*><path[^>]*></path><circle[^>]*></circle><line[^>]*></line><line[^>]*></line></svg></div>\s*<div class="input-field attendees-container".*?</div>\s*</div>', render_html.strip(), content, flags=re.DOTALL)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
