path = r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\ScheduleMeetingView.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove .innerHTML and @input bindings from description-editor
old_editor = """<div id="description-editor" class="editor-content" style="width:100%;border:1px solid #d1d1d1;font-family:inherit;overflow-y:auto;" 
                                contenteditable="true"
                                placeholder="Type details for this new meeting"
                                @input=${e => this.description = e.target.innerHTML}
                                .innerHTML=${this.description || ''}></div>"""
new_editor = """<div id="description-editor" class="editor-content" style="width:100%;border:1px solid #d1d1d1;font-family:inherit;overflow-y:auto;" 
                                contenteditable="true"
                                placeholder="Type details for this new meeting"></div>"""
content = content.replace(old_editor, new_editor)

# 2. In saveMeeting(), grab the innerHTML manually
old_save = """const meetingData = {
                title: this.title,
                description: this.description,"""
new_save = """const editor = this.shadowRoot.querySelector('#description-editor');
            const currentDesc = editor ? editor.innerHTML : '';
            const meetingData = {
                title: this.title,
                description: currentDesc,"""
content = content.replace(old_save, new_save)

# 3. Just to be clean, remove all 'this.description = editor.innerHTML' from format/paste 
content = content.replace("if (editor) this.description = editor.innerHTML;", "")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
