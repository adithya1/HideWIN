with open(r'c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js', 'r', encoding='utf-8') as f:
    text = f.read()
idx = text.find('this.renderTopToolbar()')
if idx != -1:
    print(text[max(0, idx-500):idx+500])
else:
    print("Not found")
