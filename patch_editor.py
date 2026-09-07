import re
path = r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\ScheduleMeetingView.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace editor CSS
old_toolbar_css = """            .editor-toolbar {
                border: 1px solid #d1d1d1;
                border-bottom: none;
                padding: 8px;
                display: flex;
                gap: 12px;
                background: white;
                border-radius: 4px 4px 0 0;
            }
            .editor-content {
                border: 1px solid #d1d1d1;
                border-radius: 0 0 4px 4px;
                min-height: 200px;
                padding: 12px;
                font-size: 14px;"""

new_toolbar_css = """            .editor-wrapper {
                border: 1px solid #d1d1d1;
                border-radius: 6px;
                overflow: hidden;
                background: var(--bg-app, #fff);
            }
            .editor-toolbar {
                border-bottom: 1px solid #d1d1d1;
                padding: 6px 10px;
                display: flex;
                gap: 2px;
                background: var(--bg-surface, #fafafa);
                flex-wrap: wrap;
                align-items: center;
            }
            .toolbar-group {
                display: flex;
                align-items: center;
                gap: 2px;
            }
            .toolbar-divider {
                width: 1px;
                height: 20px;
                background: #d1d1d1;
                margin: 0 6px;
            }
            .toolbar-btn {
                width: 28px;
                height: 28px;
                display: flex;
                align-items: center;
                justify-content: center;
                border: none;
                background: transparent;
                border-radius: 4px;
                cursor: pointer;
                font-size: 13px;
                color: var(--text-primary, #323130);
                transition: background 0.12s;
            }
            .toolbar-btn:hover {
                background: rgba(0,0,0,0.07);
            }
            .toolbar-btn svg {
                width: 14px;
                height: 14px;
                stroke: currentColor;
                fill: none;
                stroke-width: 2;
            }
            .editor-content {
                min-height: 160px;
                max-height: 320px;
                overflow-y: auto;
                padding: 12px;
                font-size: 14px;
                line-height: 1.6;
                outline: none;
                font-family: inherit;"""

content = content.replace(old_toolbar_css, new_toolbar_css)

# Replace the editor HTML
old_editor_html = """                        <div class="editor-toolbar">
                            <button class="toolbar-btn" style="font-weight:bold" @click=${() => document.execCommand('bold')}>B</button>
                            <button class="toolbar-btn" style="font-style:italic" @click=${() => document.execCommand('italic')}>I</button>
                            <button class="toolbar-btn" style="text-decoration:underline" @click=${() => document.execCommand('underline')}>U</button>
                            <div style="width:1px;background:#d1d1d1;margin:0 4px"></div>
                            <button class="toolbar-btn" title="Attach files" @click=${() => this.triggerAttachment()}>
                            </button>
                            <input type="file" id="file-attachment" multiple style="display:none" @change=${this.handleAttachment}>
                        </div>
                            <div id="description-editor" class="editor-content" style="width:100%;border:1px solid #d1d1d1;font-family:inherit;overflow-y:auto;" 
                                contenteditable="true"
                                placeholder="Type details for this new meeting"
                                @input=${e => this.description = e.target.innerHTML}>${this.description}</div>"""

new_editor_html = """                        <div class="editor-wrapper">
                            <div class="editor-toolbar">
                                <div class="toolbar-group">
                                    <button class="toolbar-btn" title="Heading 1" @click=${() => this.formatDesc('formatBlock','H1')}>H1</button>
                                    <button class="toolbar-btn" title="Heading 2" @click=${() => this.formatDesc('formatBlock','H2')}>H2</button>
                                </div>
                                <div class="toolbar-divider"></div>
                                <div class="toolbar-group">
                                    <button class="toolbar-btn" title="Bold" @click=${() => this.formatDesc('bold')}><b>B</b></button>
                                    <button class="toolbar-btn" title="Italic" @click=${() => this.formatDesc('italic')}><i>I</i></button>
                                    <button class="toolbar-btn" title="Underline" @click=${() => this.formatDesc('underline')}><u>U</u></button>
                                    <button class="toolbar-btn" title="Strikethrough" @click=${() => this.formatDesc('strikeThrough')}><s>S</s></button>
                                </div>
                                <div class="toolbar-divider"></div>
                                <div class="toolbar-group">
                                    <button class="toolbar-btn" title="Bullet List" @click=${() => this.formatDesc('insertUnorderedList')}>
                                        <svg viewBox="0 0 24 24"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="3" cy="6" r="1" fill="currentColor"/><circle cx="3" cy="12" r="1" fill="currentColor"/><circle cx="3" cy="18" r="1" fill="currentColor"/></svg>
                                    </button>
                                    <button class="toolbar-btn" title="Numbered List" @click=${() => this.formatDesc('insertOrderedList')}>
                                        <svg viewBox="0 0 24 24"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><text x="1" y="8" font-size="7" fill="currentColor">1.</text><text x="1" y="14" font-size="7" fill="currentColor">2.</text><text x="1" y="20" font-size="7" fill="currentColor">3.</text></svg>
                                    </button>
                                    <button class="toolbar-btn" title="Block Quote" @click=${() => this.formatDesc('formatBlock','blockquote')}>
                                        <svg viewBox="0 0 24 24"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>
                                    </button>
                                </div>
                                <div class="toolbar-divider"></div>
                                <div class="toolbar-group">
                                    <button class="toolbar-btn" title="Highlight" @click=${() => this.formatDesc('hiliteColor','#fff176')}>
                                        <svg viewBox="0 0 24 24"><rect x="3" y="17" width="18" height="4" rx="1" fill="#fff176" stroke="currentColor"/><path d="M5 17L12 3l7 14"/></svg>
                                    </button>
                                    <button class="toolbar-btn" title="Link" @click=${() => { const url = prompt('Enter URL:'); if(url) this.formatDesc('createLink', url); }}>
                                        <svg viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                                    </button>
                                </div>
                                <div class="toolbar-divider"></div>
                                <button class="toolbar-btn" title="Attach files (images, docs, zip, rar, all types)" @click=${() => this.triggerAttachment()} style="width:auto;padding:0 8px;gap:4px;display:flex;align-items:center;">
                                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" stroke-width="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                                    <span style="font-size:12px;">Attach</span>
                                </button>
                                <input type="file" id="file-attachment" multiple accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar,.7z,.txt,.csv" style="display:none" @change=${this.handleAttachment}>
                            </div>
                            <div id="description-editor"
                                class="editor-content"
                                contenteditable="true"
                                data-placeholder="Write meeting details, agenda, notes…"
                                @input=${e => { this.description = e.target.innerHTML; }}
                                @paste=${e => this._handleDescPaste(e)}>
                            </div>
                        </div>"""

content = content.replace(old_editor_html, new_editor_html)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
