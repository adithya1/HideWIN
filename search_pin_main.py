with open(r'C:\Users\akula\Downloads\HW-BKP\Hide-Win-Master - Copy (4)\src\components\views\MainView.js', 'r', encoding='utf-8') as f:
    text = f.read()
import re
matches = re.finditer(r'.{0,50}pin.{0,50}', text, re.IGNORECASE)
for m in matches:
    print(m.group(0))
