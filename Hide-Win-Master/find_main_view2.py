with open(r'c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\MainView.js', 'r', encoding='utf-8') as f:
    text = f.read()
idx = text.find('Select Mode')
print(text[max(0, idx-200):idx+800])
