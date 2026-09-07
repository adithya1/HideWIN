import re

with open(r'c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\NotesView.js', 'r', encoding='utf-8') as f:
    text = f.read()

print('--- pinToHome ---')
m = re.search(r'pinToHome.*?\}', text, re.DOTALL)
if m: print(m.group(0))

print('\n--- pinToDesktop ---')
m = re.search(r'pinToDesktop.*?\}', text, re.DOTALL)
if m: print(m.group(0))

print('\n--- Back button ---')
m = re.search(r'title="Back to Notes List".*?</button>', text, re.DOTALL)
if m: print(m.group(0))

print('\n--- Note controls ---')
m = re.search(r'class="editor-controls".*?</div>', text, re.DOTALL)
if m: print(m.group(0))
