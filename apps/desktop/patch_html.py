import sys
file = r'c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\index.html'
content = open(file, 'r', encoding='utf-8').read()
content = content.replace('assets/ort.min.js', 'assets/ort.min.js?v=2')
open(file, 'w', encoding='utf-8').write(content)
print("Updated index.html")
