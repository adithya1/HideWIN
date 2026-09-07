with open(r'c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js', 'r', encoding='utf-8') as f:
    text = f.read()
idx = text.find('app-header')
if idx != -1:
    print(text[max(0, idx-100):idx+800])
else:
    print("Not found")
