import re
with open(r'c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\MainView.js', 'r', encoding='utf-8') as f:
    text = f.read()

match = re.search(r'class="main-controls-container"', text)
if match:
    idx = match.start()
    print(text[idx:idx+800].encode('ascii', 'ignore').decode())
else:
    match2 = re.search(r'<div[^>]*>.*?Select Mode.*?</div', text, re.IGNORECASE | re.DOTALL)
    if match2:
        print(match2.group(0).encode('ascii', 'ignore').decode()[:800])
