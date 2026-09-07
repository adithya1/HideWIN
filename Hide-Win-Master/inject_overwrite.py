with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\MouseBlocker.cs', 'r', encoding='utf-8') as f:
    content = f.read()

target = """        // FORCE windows to drop the 'app launching' spinner that happens when an .exe starts
        RestoreCursors();"""

rep = """        // OVERWRITE the loading spinners with the normal arrow!
        IntPtr arrow = LoadCursor(IntPtr.Zero, 32512);
        SetSystemCursor(CopyIcon(arrow), 32514); // IDC_WAIT
        SetSystemCursor(CopyIcon(arrow), 32650); // IDC_APPSTARTING"""

if target in content:
    content = content.replace(target, rep)
    with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\MouseBlocker.cs', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Injected Overwrite Cursors")
else:
    print("Target not found")
