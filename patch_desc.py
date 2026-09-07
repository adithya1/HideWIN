path = r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\ScheduleMeetingView.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add formatDesc and _handleDescPaste methods near saveMeeting
new_methods = """
    formatDesc(command, value = null) {
        const editor = this.shadowRoot.querySelector('#description-editor');
        if (editor) editor.focus();
        document.execCommand(command, false, value);
        if (editor) this.description = editor.innerHTML;
    }

    _handleDescPaste(e) {
        e.preventDefault();
        const text = (e.clipboardData || window.clipboardData).getData('text/plain');
        document.execCommand('insertHTML', false, text.replace(/\\n/g, '<br>'));
        const editor = this.shadowRoot.querySelector('#description-editor');
        if (editor) this.description = editor.innerHTML;
    }

"""

# Inject before saveMeeting
content = content.replace("    async saveMeeting()", new_methods + "    async saveMeeting()")

# Add placeholder CSS for the editor
placeholder_css = """
            .editor-content:empty::before {
                content: attr(data-placeholder);
                color: #aaa;
                pointer-events: none;
            }
            .editor-content ul, .editor-content ol {
                margin: 6px 0;
                padding-left: 22px;
            }
            .editor-content li {
                margin: 2px 0;
            }
            .editor-content h1, .editor-content h2 {
                margin: 8px 0 4px;
                font-weight: 700;
            }
            .editor-content blockquote {
                border-left: 3px solid var(--accent, #185fc4);
                margin: 4px 0;
                padding: 4px 12px;
                color: var(--text-secondary, #605e5c);
                background: rgba(0,0,0,0.02);
            }
"""

# Inject before ::-webkit-scrollbar
content = content.replace("        ::-webkit-scrollbar", placeholder_css + "        ::-webkit-scrollbar", 1)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
