with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\window.js', 'r', encoding='utf-8') as f:
    content = f.read()

target = 'const b = targetWin.getBounds();'
rep = 'const b = targetWin.getContentBounds();'
if target in content:
    content = content.replace(target, rep)
    
target2 = 'const b = win.getBounds();'
rep2 = 'const b = win.getContentBounds();'
if target2 in content:
    content = content.replace(target2, rep2)

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\window.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated to getContentBounds")
