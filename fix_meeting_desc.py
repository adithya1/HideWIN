import re
path = r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\ScheduleMeetingView.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the innerHTML binding to avoid Lit comment markers
old_html = """                                class="editor-content"
                                contenteditable="true"
                                data-placeholder="Write meeting details, agenda, notes…"
                                @input=${e => { this.description = e.target.innerHTML; }}
                                @paste=${e => this._handleDescPaste(e)}>
                            </div>"""

new_html = """                                class="editor-content"
                                contenteditable="true"
                                data-placeholder="Write meeting details, agenda, notes…"
                                @input=${e => { this.description = e.target.innerHTML; }}
                                @paste=${e => this._handleDescPaste(e)}
                                .innerHTML=${this.description || ''}>
                            </div>"""
content = content.replace(old_html, new_html)

# Also there was a leftover ${this.description} in case I missed something before. 
# Let's clean it up using regex just to be sure:
content = re.sub(
    r'@input=\$\{e\s*=>\s*\{\s*this\.description\s*=\s*e\.target\.innerHTML;\s*\}\}\s*\n\s*@paste=\$\{e\s*=>\s*this\._handleDescPaste\(e\)\}\s*>\s*(?:\$\{this\.description\})?\s*</div>',
    r'@input=${e => { this.description = e.target.innerHTML; }}\n                                @paste=${e => this._handleDescPaste(e)}\n                                .innerHTML=${this.description || ""}>\n                            </div>',
    content
)

# Upgrade _handleDescPaste
old_paste = """    _handleDescPaste(e) {
        e.preventDefault();
        const text = (e.clipboardData || window.clipboardData).getData('text/plain');
        document.execCommand('insertHTML', false, text.replace(/\\n/g, '<br>'));
        const editor = this.shadowRoot.querySelector('#description-editor');
        if (editor) this.description = editor.innerHTML;
    }"""

new_paste = """    _handleDescPaste(e) {
        e.preventDefault();
        const clipboardData = e.clipboardData || window.clipboardData;
        const htmlData = clipboardData.getData('text/html');
        const textData = clipboardData.getData('text/plain');

        if (clipboardData.files && clipboardData.files.length > 0) {
            const file = clipboardData.files[0];
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const base64Data = event.target.result;
                    const imgTag = `<img src="${base64Data}" alt="Pasted Image"/>`;
                    document.execCommand('insertHTML', false, imgTag);
                    const editor = this.shadowRoot.querySelector('#description-editor');
                    if (editor) this.description = editor.innerHTML;
                };
                reader.readAsDataURL(file);
                return;
            }
        }

        if (htmlData) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = htmlData;
            const safeHtml = tempDiv.innerHTML.replace(/<script\\b[^<]*(?:(?!<\\/script>)<[^<]*)*<\\/script>/gi, '');
            document.execCommand('insertHTML', false, safeHtml);
        } else if (textData) {
            const formattedText = textData.replace(/\\r?\\n/g, '<br>');
            document.execCommand('insertHTML', false, formattedText);
        }
        const editor = this.shadowRoot.querySelector('#description-editor');
        if (editor) this.description = editor.innerHTML;
    }"""
content = content.replace(old_paste, new_paste)

# Add image resizing CSS
css_inject = """            .editor-content blockquote {
                border-left: 3px solid var(--accent, #185fc4);
                margin: 4px 0;
                padding: 4px 12px;
                color: var(--text-secondary, #605e5c);
                background: rgba(0,0,0,0.02);
            }
            .editor-content img {
                max-width: 100%;
                height: auto;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                margin: 8px 0;
            }"""
content = content.replace("            .editor-content blockquote {\n                border-left: 3px solid var(--accent, #185fc4);\n                margin: 4px 0;\n                padding: 4px 12px;\n                color: var(--text-secondary, #605e5c);\n                background: rgba(0,0,0,0.02);\n            }", css_inject)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
