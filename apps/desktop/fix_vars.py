with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\MouseBlocker.cs', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("int frozenX = int.Parse(parts[4]);", "int fX = int.Parse(parts[4]);")
content = content.replace("int frozenY = int.Parse(parts[5]);", "int fY = int.Parse(parts[5]);")
content = content.replace("SetCursorPos(frozenX, frozenY);", "SetCursorPos(fX, fY);")
content = content.replace("int frozenX = int.Parse(parts[3]);", "int fX = int.Parse(parts[3]);")
content = content.replace("int frozenY = int.Parse(parts[4]);", "int fY = int.Parse(parts[4]);")

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\MouseBlocker.cs', 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixed variable names")
