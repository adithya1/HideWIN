import re

path_meeting = r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\ScheduleMeetingView.js'
with open(path_meeting, 'r', encoding='utf-8') as f:
    content = f.read()

old_toolbar = """<div class="editor-toolbar">
                            <button class="toolbar-btn" style="font-weight:bold" @click=${() => document.execCommand('bold')}>B</button>
                            <button class="toolbar-btn" style="font-style:italic" @click=${() => document.execCommand('italic')}>I</button>
                            <button class="toolbar-btn" style="text-decoration:underline" @click=${() => document.execCommand('underline')}>U</button>
                            <div style="width:1px;background:#d1d1d1;margin:0 4px"></div>
                            <button class="toolbar-btn" title="Attach files" @click=${() => this.triggerAttachment()}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
                            </button>
                            <input type="file" id="file-attachment" multiple style="display:none" @change=${this.handleAttachment}>
                        </div>"""

new_toolbar = """<div class="editor-toolbar">
                            <div class="toolbar-group">
                                <button class="toolbar-btn" title="Heading 1" @click=${() => this.formatDesc('formatBlock', 'H1')}>H1</button>
                                <button class="toolbar-btn" title="Heading 2" @click=${() => this.formatDesc('formatBlock', 'H2')}>H2</button>
                                <button class="toolbar-btn" title="Heading 3" @click=${() => this.formatDesc('formatBlock', 'H3')}>H3</button>
                            </div>
                            <div class="toolbar-divider"></div>
                            <div class="toolbar-group">
                                <button class="toolbar-btn" title="Bold" @click=${() => this.formatDesc('bold')}><b>B</b></button>
                                <button class="toolbar-btn" title="Italic" @click=${() => this.formatDesc('italic')}><i>I</i></button>
                                <button class="toolbar-btn" title="Underline" @click=${() => this.formatDesc('underline')}><u>U</u></button>
                                <button class="toolbar-btn" title="Strikethrough" @click=${() => this.formatDesc('strikeThrough')}><s>S</s></button>
                                <button class="toolbar-btn" title="Highlight" @click=${() => this.formatDesc('hiliteColor', '#ffeb3b')}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                                    </svg>
                                </button>
                                <button class="toolbar-btn" title="Text Color" @click=${() => this.formatDesc('foreColor', '#185fc4')}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg>
                                </button>
                            </div>
                            <div class="toolbar-divider"></div>
                            <div class="toolbar-group">
                                <button class="toolbar-btn" title="Bullet List" @click=${() => this.formatDesc('insertUnorderedList')}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                                </button>
                                <button class="toolbar-btn" title="Numbered List" @click=${() => this.formatDesc('insertOrderedList')}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="10" y1="6" x2="21" y2="6"></line><line x1="10" y1="12" x2="21" y2="12"></line><line x1="10" y1="18" x2="21" y2="18"></line><path d="M4 6h1v4"></path><path d="M4 10h2"></path><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path></svg>
                                </button>
                                <button class="toolbar-btn" title="Indent" @click=${() => this.formatDesc('indent')}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line><line x1="11" y1="12" x2="21" y2="12"></line><polyline points="3 8 7 12 3 16"></polyline></svg>
                                </button>
                                <button class="toolbar-btn" title="Outdent" @click=${() => this.formatDesc('outdent')}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line><line x1="11" y1="12" x2="21" y2="12"></line><polyline points="7 8 3 12 7 16"></polyline></svg>
                                </button>
                            </div>
                            <div class="toolbar-divider"></div>
                            <div class="toolbar-group">
                                <button class="toolbar-btn" title="Align Left" @click=${() => this.formatDesc('justifyLeft')}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="15" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                                </button>
                                <button class="toolbar-btn" title="Align Center" @click=${() => this.formatDesc('justifyCenter')}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="7" y1="12" x2="17" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                                </button>
                                <button class="toolbar-btn" title="Align Right" @click=${() => this.formatDesc('justifyRight')}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="9" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                                </button>
                            </div>
                            <div class="toolbar-divider"></div>
                            <div class="toolbar-group">
                                <button class="toolbar-btn" title="Blockquote" @click=${() => this.formatDesc('formatBlock', 'BLOCKQUOTE')}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path></svg>
                                </button>
                                <button class="toolbar-btn" title="Code Block" @click=${() => this.formatDesc('formatBlock', 'PRE')}>Code</button>
                                <button class="toolbar-btn" title="Divider" @click=${() => this.formatDesc('insertHorizontalRule')}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line></svg>
                                </button>
                                <button class="toolbar-btn" title="Insert Link" @click=${() => { const url = prompt('Enter URL:'); if(url) this.formatDesc('createLink', url); }}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                                </button>
                                <button class="toolbar-btn" title="Attach Document" @click=${() => this.triggerAttachment()}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
                                </button>
                                <button class="toolbar-btn" title="Clear Formatting" @click=${() => this.formatDesc('removeFormat')}>Clear</button>
                            </div>
                            <input type="file" id="file-attachment" multiple style="display:none" @change=${this.handleAttachment}>
                        </div>"""

# Remove whitespace to match exactly if regex fails
if old_toolbar not in content:
    print("Warning: old_toolbar not found exactly. Falling back to regex.")
    content = re.sub(r'<div class="editor-toolbar">.*?</div>\s*<div id="description-editor"', new_toolbar + '\n                            <div id="description-editor"', content, flags=re.DOTALL)
else:
    content = content.replace(old_toolbar, new_toolbar)

# Add toolbar CSS to ScheduleMeetingView if it's missing (it usually borrows from global, but just in case)
css_to_add = """
            .editor-toolbar {
                display: flex;
                align-items: center;
                gap: 4px;
                padding: 6px 10px;
                background: #f8f9fa;
                border-bottom: 1px solid #e5e7eb;
                overflow-x: auto;
                border-top-left-radius: 8px;
                border-top-right-radius: 8px;
                flex-wrap: wrap;
            }
            .toolbar-group {
                display: flex;
                align-items: center;
                gap: 2px;
            }
            .toolbar-divider {
                width: 1px;
                height: 16px;
                background: #e5e7eb;
                margin: 0 4px;
            }
            .toolbar-btn {
                background: transparent;
                border: none;
                border-radius: 4px;
                padding: 4px;
                color: #4b5563;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                min-width: 28px;
                height: 28px;
                font-size: 13px;
                font-weight: 600;
                transition: all 0.15s;
            }
            .toolbar-btn:hover {
                background: #e5e7eb;
                color: #111827;
            }
            .toolbar-btn svg {
                width: 16px;
                height: 16px;
            }
"""
if ".editor-toolbar" not in content:
    content = content.replace("static get styles() {\n        return css`", "static get styles() {\n        return css`" + css_to_add)

with open(path_meeting, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated ScheduleMeetingView.js")
