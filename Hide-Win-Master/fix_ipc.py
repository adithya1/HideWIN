import re

with open(r'c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\NotesView.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Fix loadNotes
old_load = r"this\.notes = await ipcRenderer\.invoke\('get-notes'\);"
new_load = r"const res = await ipcRenderer.invoke('storage:get-notes'); this.notes = (res && res.success) ? res.data : [];"
text = re.sub(old_load, new_load, text)

# Fix saveNotes
old_save = r"await ipcRenderer\.invoke\('save-notes', this\.notes\);"
new_save = r"await ipcRenderer.invoke('storage:save-notes', this.notes);"
text = re.sub(old_save, new_save, text)

# Fix SVG size
old_svg = r'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>'
new_svg = r'<svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="2" style="opacity: 0.5; margin-bottom: 16px;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>'
text = text.replace(old_svg, new_svg)

with open(r'c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\NotesView.js', 'w', encoding='utf-8') as f:
    f.write(text)
print('Fixed IPC and SVG')
