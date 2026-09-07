import re
with open(r'c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\MainView.js', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('_renderActionBar()')
print(text[idx:idx+2500].encode('ascii', 'ignore').decode())
