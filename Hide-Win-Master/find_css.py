with open(r'c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js', 'r', encoding='utf-8') as f:
    text = f.read()
idx = text.find('css`')
if idx != -1:
    print(text[idx:idx+1500])
else:
    print('Not found')
