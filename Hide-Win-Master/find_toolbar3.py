with open(r'c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js', 'r', encoding='utf-8') as f:
    text = f.read()
idx = text.find('renderTopToolbar() {')
idx2 = text.find('return html`', idx)
print(text[idx2:idx2+1000])
