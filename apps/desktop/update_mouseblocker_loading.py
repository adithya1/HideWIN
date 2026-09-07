import re

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\MouseBlocker.cs', 'r', encoding='utf-8') as f:
    content = f.read()

dll_imports = """    [DllImport("user32.dll")]
    public static extern IntPtr LoadCursor(IntPtr hInstance, int lpCursorName);
    
    [DllImport("user32.dll")]
    public static extern IntPtr CopyIcon(IntPtr pcur);

    public static void SetLoadingCursor() {
        IntPtr waitCursor = LoadCursor(IntPtr.Zero, 32514);
        
        SetSystemCursor(CopyIcon(waitCursor), 32512); // Arrow
        SetSystemCursor(CopyIcon(waitCursor), 32513); // IBeam
        SetSystemCursor(CopyIcon(waitCursor), 32649); // Hand
    }"""

if 'LoadCursor' not in content:
    content = content.replace('public static extern IntPtr CreateCursor', dll_imports + '\n\n    [DllImport("user32.dll")]\n    public static extern IntPtr CreateCursor')

if 'SetLoadingCursor();' not in content:
    content = content.replace('// HideCursors(); // User wants cursor visible and frozen', 'SetLoadingCursor();')

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\MouseBlocker.cs', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated MouseBlocker.cs")
