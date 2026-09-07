with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\MouseBlocker.cs', 'r', encoding='utf-8') as f:
    content = f.read()

target = """        // SetLoadingCursor(); // Reverted back to normal frozen arrow
        Application.Run(wnd);"""

rep = """        // SetLoadingCursor(); // Reverted back to normal frozen arrow
        
        // FORCE windows to drop the 'app launching' spinner that happens when an .exe starts
        RestoreCursors();
        
        Application.Run(wnd);"""

if target in content:
    content = content.replace(target, rep)
    with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\MouseBlocker.cs', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Injected RestoreCursors on boot")
else:
    print("Target not found")
