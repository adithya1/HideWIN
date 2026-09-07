with open(r'c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js', 'r', encoding='utf-8') as f:
    text = f.read()
idx = text.find('render() {')
idx2 = text.find('renderMainView', idx)
if idx2 != -1:
    print(text[max(0, idx2-100):idx2+2500])
else:
    print("Not found")
