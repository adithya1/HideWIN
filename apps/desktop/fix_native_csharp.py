with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\MouseBlocker.cs', 'r', encoding='utf-8') as f:
    content = f.read()

import re

# Add user32 imports for SetCursorPos and mouse_event
if "mouse_event" not in content:
    content = content.replace('public static extern IntPtr SetCursor(IntPtr hCursor);', 
    'public static extern IntPtr SetCursor(IntPtr hCursor);\n\n    [DllImport("user32.dll")]\n    static extern void mouse_event(uint dwFlags, uint dx, uint dy, uint dwData, int dwExtraInfo);\n    [DllImport("user32.dll")]\n    [return: MarshalAs(UnmanagedType.Bool)]\n    static extern bool SetCursorPos(int X, int Y);\n    private const uint MOUSEEVENTF_LEFTDOWN = 0x0002;\n    private const uint MOUSEEVENTF_LEFTUP = 0x0004;\n    private const uint MOUSEEVENTF_RIGHTDOWN = 0x0008;\n    private const uint MOUSEEVENTF_RIGHTUP = 0x0010;\n    private const uint MOUSEEVENTF_WHEEL = 0x0800;')

# Update Reader Thread
reader_target = """                    if (line.StartsWith("LOCK")) { netDX = 0; netDY = 0; _isLocked = true; }
                    else if (line.StartsWith("UNLOCK")) _isLocked = false;
                    else if (line == "EXIT") break;"""

reader_rep = """                    if (line.StartsWith("LOCK")) { netDX = 0; netDY = 0; _isLocked = true; }
                    else if (line.StartsWith("UNLOCK")) _isLocked = false;
                    else if (line == "EXIT") break;
                    else if (line.StartsWith("CLICK:")) {
                        try {
                            string[] parts = line.Substring(6).Split(',');
                            int x = int.Parse(parts[0]);
                            int y = int.Parse(parts[1]);
                            string action = parts[2];
                            string button = parts[3];
                            int frozenX = int.Parse(parts[4]);
                            int frozenY = int.Parse(parts[5]);
                            SetCursorPos(x, y);
                            uint flag = 0;
                            if (button == "left") flag = (action == "down") ? MOUSEEVENTF_LEFTDOWN : MOUSEEVENTF_LEFTUP;
                            else flag = (action == "down") ? MOUSEEVENTF_RIGHTDOWN : MOUSEEVENTF_RIGHTUP;
                            mouse_event(flag, 0, 0, 0, 0);
                            SetCursorPos(frozenX, frozenY);
                        } catch {}
                    }
                    else if (line.StartsWith("SCROLL:")) {
                        try {
                            string[] parts = line.Substring(7).Split(',');
                            int notches = int.Parse(parts[0]);
                            int x = int.Parse(parts[1]);
                            int y = int.Parse(parts[2]);
                            int frozenX = int.Parse(parts[3]);
                            int frozenY = int.Parse(parts[4]);
                            SetCursorPos(x, y);
                            mouse_event(MOUSEEVENTF_WHEEL, 0, 0, (uint)(notches * 120), 0);
                            SetCursorPos(frozenX, frozenY);
                        } catch {}
                    }"""

if reader_target in content:
    content = content.replace(reader_target, reader_rep)

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\MouseBlocker.cs', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated MouseBlocker.cs")
