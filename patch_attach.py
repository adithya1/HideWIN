import re
path = r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\ScheduleMeetingView.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

attach_html = """
                    <div style="margin-top:24px;">
                        ${this.attachments.length > 0 ? html`
                            <div style="display:flex; flex-wrap:wrap; gap:8px; margin-bottom:8px;">
                                ${this.attachments.map((file, i) => html`
                                    <div class="attachment-pill">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
                                        ${file.name}
                                        <span style="cursor:pointer;font-weight:bold" @click=${() => this.removeAttachment(i)}>x</span>
                                    </div>
                                `)}
                            </div>
                        ` : ''}
                        <div class="editor-toolbar">
                            <button class="toolbar-btn" style="font-weight:bold" @click=${() => document.execCommand('bold')}>B</button>
                            <button class="toolbar-btn" style="font-style:italic" @click=${() => document.execCommand('italic')}>I</button>
                            <button class="toolbar-btn" style="text-decoration:underline" @click=${() => document.execCommand('underline')}>U</button>
                            <div style="width:1px;background:#d1d1d1;margin:0 4px"></div>
                            <button class="toolbar-btn" title="Attach files" @click=${() => this.triggerAttachment()}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
                            </button>
                            <input type="file" id="file-attachment" multiple style="display:none" @change=${this.handleAttachment}>
                        </div>
"""

content = re.sub(r'<div class="editor-toolbar">.*?</div>', attach_html.strip(), content, flags=re.DOTALL)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
