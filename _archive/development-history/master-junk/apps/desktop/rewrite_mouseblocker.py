with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\MouseBlocker.cs', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the variables at the top
top_replace = """    public static bool _running = true;
    public static IntPtr _hookID = IntPtr.Zero;
    public static bool _isLocked = false;"""

content = content.replace("    public static bool _running = true;\n    public static IntPtr _hookID = IntPtr.Zero;", top_replace)

# Replace HookCallback
hook_target = """    private static IntPtr HookCallback(int nCode, IntPtr wParam, IntPtr lParam) {
        if (nCode >= 0) {
            // Block everything (move, click, scroll) from reaching background apps!
            return (IntPtr)1; 
        }
        return CallNextHookEx(_hookID, nCode, wParam, lParam);
    }"""

hook_rep = """    private static IntPtr HookCallback(int nCode, IntPtr wParam, IntPtr lParam) {
        if (nCode >= 0 && _isLocked) {
            // Block everything only when locked!
            return (IntPtr)1; 
        }
        return CallNextHookEx(_hookID, nCode, wParam, lParam);
    }"""
content = content.replace(hook_target, hook_rep)

# Replace reader thread
reader_target = """        Thread readerThread = new Thread(() => {
            try { Console.ReadLine(); } catch { }
            _running = false;
            if (_hookID != IntPtr.Zero) UnhookWindowsHookEx(_hookID);
            Environment.Exit(0);
        });"""

reader_rep = """        Thread readerThread = new Thread(() => {
            while (true) {
                try {
                    string line = Console.ReadLine();
                    if (line == null) break;
                    line = line.Trim();
                    if (line.StartsWith("LOCK")) _isLocked = true;
                    else if (line.StartsWith("UNLOCK")) _isLocked = false;
                    else if (line == "EXIT") break;
                } catch { break; }
            }
            _running = false;
            if (_hookID != IntPtr.Zero) UnhookWindowsHookEx(_hookID);
            Environment.Exit(0);
        });"""
content = content.replace(reader_target, reader_rep)

# Remove any LoadCursor / Overwrite logic from Main
main_target_start = """        // OVERWRITE the loading spinners with the normal arrow!"""
main_target_end = """        Application.Run(wnd);"""

import re
content = re.sub(r'        // OVERWRITE the loading spinners.*?\n.*?IDC_WAIT\n.*?IDC_APPSTARTING\n\n        Application\.Run\(wnd\);', '        Application.Run(wnd);', content, flags=re.DOTALL)

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\MouseBlocker.cs', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated MouseBlocker.cs")
