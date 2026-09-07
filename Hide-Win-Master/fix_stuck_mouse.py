with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\MouseBlocker.cs', 'r', encoding='utf-8') as f:
    content = f.read()

target = 'else if (line.StartsWith("UNLOCK")) _isLocked = false;'
rep = """else if (line.StartsWith("UNLOCK")) { 
                        _isLocked = false; 
                        mouse_event(MOUSEEVENTF_LEFTUP | MOUSEEVENTF_RIGHTUP, 0, 0, 0, 0);
                    }"""

if target in content:
    content = content.replace(target, rep)
    with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\MouseBlocker.cs', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Fixed stuck mouse button bug")
else:
    print("Target not found")
