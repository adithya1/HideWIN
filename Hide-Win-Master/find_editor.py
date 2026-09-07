with open(r'c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\NotesView.js', 'r', encoding='utf-8') as f:
    text = f.read()
idx = text.find('editor-toolbar')
print(text[idx-200:idx+800])
