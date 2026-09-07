with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\MainView.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()
    for i, line in enumerate(lines):
        if 'main-content' in line or 'app-container' in line:
            print("".join(lines[max(0, i-5):min(len(lines), i+15)]))
            break
