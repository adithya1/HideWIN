import re

def process_file(path, is_notes):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Add select styles if not exists
    if '.toolbar-select' not in content:
        select_css = """
            .toolbar-select {
                background: transparent;
                border: 1px solid transparent;
                border-radius: 4px;
                padding: 2px 4px;
                color: #4b5563;
                font-size: 13px;
                font-weight: 600;
                cursor: pointer;
                outline: none;
                transition: all 0.15s;
                max-width: 90px;
            }
            .toolbar-select:hover {
                background: #e5e7eb;
                color: #111827;
            }
            .toolbar-btn.active {
                background: #bfdbfe;
                color: #1d4ed8;
            }"""
        content = content.replace("static get styles() {\n        return css`", "static get styles() {\n        return css`" + select_css)

    # 2. Add properties for format painter
    if 'isFormatPainting: { type: Boolean }' not in content:
        content = content.replace("static properties = {", "static properties = {\n        isFormatPainting: { type: Boolean },\n        copiedFormat: { type: Object },")
        # Initialize in constructor
        content = content.replace("super();", "super();\n        this.isFormatPainting = false;\n        this.copiedFormat = null;")

    # 3. Add format painter logic
    if 'toggleFormatPainter()' not in content:
        logic = """
    toggleFormatPainter() {
        if (this.isFormatPainting) {
            this.isFormatPainting = false;
            this.copiedFormat = null;
            this.requestUpdate();
            return;
        }
        
        const selection = window.getSelection();
        if (!selection.rangeCount) return;
        
        const parent = selection.anchorNode.nodeType === 3 ? selection.anchorNode.parentElement : selection.anchorNode;
        const styles = window.getComputedStyle(parent);
        
        this.copiedFormat = {
            fontWeight: styles.fontWeight,
            fontStyle: styles.fontStyle,
            textDecoration: styles.textDecoration,
            color: styles.color,
            backgroundColor: styles.backgroundColor,
            fontFamily: styles.fontFamily,
            fontSize: styles.fontSize
        };
        
        this.isFormatPainting = true;
        this.requestUpdate();
        this.showToast('Format copied! Select text to apply', 'success');
    }

    applyFormatPainter(e) {
        if (!this.isFormatPainting || !this.copiedFormat) return;
        
        const selection = window.getSelection();
        if (!selection.isCollapsed && selection.rangeCount > 0) {
            const cf = this.copiedFormat;
            const editor = this.shadowRoot.querySelector('#description-editor') || this.shadowRoot.querySelector('.full-note-editor');
            if (editor) editor.focus();
            
            if (cf.fontWeight === 'bold' || parseInt(cf.fontWeight) >= 600) document.execCommand('bold');
            if (cf.fontStyle === 'italic') document.execCommand('italic');
            if (cf.textDecoration.includes('underline')) document.execCommand('underline');
            if (cf.textDecoration.includes('line-through')) document.execCommand('strikeThrough');
            if (cf.color && cf.color !== 'rgba(0, 0, 0, 0)' && cf.color !== 'rgb(0, 0, 0)') document.execCommand('foreColor', false, cf.color);
            if (cf.backgroundColor && cf.backgroundColor !== 'rgba(0, 0, 0, 0)' && cf.backgroundColor !== 'transparent') document.execCommand('hiliteColor', false, cf.backgroundColor);
            if (cf.fontFamily) document.execCommand('fontName', false, cf.fontFamily);
            
            this.isFormatPainting = false;
            this.copiedFormat = null;
            this.requestUpdate();
            this.showToast('Format applied!', 'success');
        }
    }
"""
        if is_notes:
            content = content.replace("format(command, value = null) {", logic + "\n    format(command, value = null) {")
        else:
            content = content.replace("formatDesc(command, value = null) {", logic + "\n    formatDesc(command, value = null) {")

    # 4. Attach mouseup to editor
    if '@mouseup=${e => this.applyFormatPainter(e)}' not in content:
        if is_notes:
            content = content.replace("@click=${e => this.handleEditorClick(e)}", "@click=${e => this.handleEditorClick(e)}\n                              @mouseup=${e => this.applyFormatPainter(e)}")
        else:
            content = content.replace("placeholder=\"Type details for this new meeting\"", "placeholder=\"Type details for this new meeting\"\n                                  @mouseup=${e => this.applyFormatPainter(e)}")

    # 5. Update Toolbar UI
    format_fn = "format" if is_notes else "formatDesc"
    
    # Font Dropdowns
    font_dropdowns = f"""<select class="toolbar-select" @change=${{e => this.{format_fn}('fontName', e.target.value)}}>
                                    <option value="">Font</option>
                                    <option value="Arial">Arial</option>
                                    <option value="Consolas">Consolas</option>
                                    <option value="Georgia">Georgia</option>
                                    <option value="Tahoma">Tahoma</option>
                                    <option value="Times New Roman">Times</option>
                                </select>
                                <select class="toolbar-select" @change=${{e => this.{format_fn}('fontSize', e.target.value)}}>
                                    <option value="">Size</option>
                                    <option value="1">Small</option>
                                    <option value="3">Normal</option>
                                    <option value="5">Large</option>
                                    <option value="7">Huge</option>
                                </select>"""
    
    # Format Painter
    painter_btn = f"""<button class="toolbar-btn ${{this.isFormatPainting ? 'active' : ''}}" title="Format Painter (Copy styles)" @click=${{() => this.toggleFormatPainter()}}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                                </button>"""

    # We will inject these into the first toolbar-group (Headings)
    content = re.sub(r'(<div class="toolbar-group">.*?)(</div>\s*<div class="toolbar-divider"></div>)', r'\1' + font_dropdowns + painter_btn + r'\2', content, count=1, flags=re.DOTALL)

    # Convert Color Buttons to Inputs
    old_hilite = f"""<button class="toolbar-btn" title="Highlight" @click=${{() => this.{format_fn}('hiliteColor', '#ffeb3b')}}>
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                                  </svg>
                              </button>"""
    new_hilite = f"""<label class="toolbar-btn" title="Highlight Color" style="cursor:pointer; position:relative;">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                                    <input type="color" style="opacity:0; position:absolute; width:100%; height:100%; top:0; left:0; cursor:pointer;" @input=${{e => this.{format_fn}('hiliteColor', e.target.value)}}>
                                </label>"""
    
    # Strip whitespace for safer replace
    old_hilite_clean = re.sub(r'\s+', '', old_hilite)
    content_clean = re.sub(r'\s+', '', content)
    
    if old_hilite_clean in content_clean:
        # Use regex to replace accurately
        content = re.sub(r'<button class="toolbar-btn" title="Highlight".*?</button>', new_hilite, content, flags=re.DOTALL)
    
    old_color = f'<button class="toolbar-btn" title="Text Color"'
    new_color = f"""<label class="toolbar-btn" title="Text Color" style="cursor:pointer; position:relative;">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg>
                                    <input type="color" style="opacity:0; position:absolute; width:100%; height:100%; top:0; left:0; cursor:pointer;" @input=${{e => this.{format_fn}('foreColor', e.target.value)}}>
                                </label>"""
    content = re.sub(r'<button class="toolbar-btn" title="Text Color".*?</button>', new_color, content, flags=re.DOTALL)

    # If NotesView doesn't have showToast, add a simple one just for the painter
    if is_notes and 'showToast(msg' not in content:
        content = content.replace('format(command', "showToast(msg) { hideWin.setStatus(msg); }\n    format(command")

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

process_file(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\ScheduleMeetingView.js', False)
process_file(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\NotesView.js', True)

print("Updated both files")
