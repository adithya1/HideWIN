import re
path = r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\ScheduleMeetingView.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update text area to contenteditable div
content = content.replace("""<textarea class="editor-content" style="width:100%;border:1px solid #d1d1d1;resize:vertical;font-family:inherit" 
                                placeholder="Type details for this new meeting"
                                .value=${this.description} 
                                @input=${e => this.description = e.target.value}></textarea>""", 
"""<div id="description-editor" class="editor-content" style="width:100%;border:1px solid #d1d1d1;font-family:inherit;overflow-y:auto;" 
                                contenteditable="true"
                                placeholder="Type details for this new meeting"
                                @input=${e => this.description = e.target.innerHTML}>${this.description}</div>""")

# 2. Add execCommand to toolbar buttons
toolbar_html = """
                            <div class="editor-toolbar">
                                <span style="font-weight:bold;cursor:pointer" @click=${() => document.execCommand('bold', false, null)}>B</span>
                                <span style="font-style:italic;cursor:pointer" @click=${() => document.execCommand('italic', false, null)}>I</span>
                                <span style="text-decoration:underline;cursor:pointer" @click=${() => document.execCommand('underline', false, null)}>U</span>
                                <span style="text-decoration:line-through;cursor:pointer" @click=${() => document.execCommand('strikeThrough', false, null)}>S</span>
                            </div>
"""
content = re.sub(r'<div class="editor-toolbar">.*?</div>', toolbar_html.strip(), content, flags=re.DOTALL)

# 3. Pass invite_url_base in the API payload
payload_update = """
            const payload = {
                title: this.title,
                description: this.description,
                start_time: new Date(`${this.startDate}T${this.startTime}:00Z`).toISOString(),
                end_time: new Date(`${this.endDate}T${this.endTime}:00Z`).toISOString(),
                timezone: this.timezone,
                location: this.location,
                recurrence: this.recurrence,
                participants: this.attendees,
                invite_url_base: dnsIP.includes('.loca.lt') ? `https://${dnsIP}/invite/index.html` : `http://${dnsIP}:${dnsPort}/invite/index.html`
            };
"""
content = re.sub(r'const payload = \{.*?\};\s+', payload_update, content, flags=re.DOTALL)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
