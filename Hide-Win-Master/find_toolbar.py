with open(r'c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js', 'r', encoding='utf-8') as f:
    text = f.read()
for line in text.split('\n'):
    if 'top-toolbar' in line and '<div' in line:
        print(line.strip())
