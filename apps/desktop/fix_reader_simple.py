with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\MouseBlocker.cs', 'r', encoding='utf-8') as f:
    content = f.read()

start_idx = content.find("        Thread readerThread = new Thread(() => {")
end_idx = content.find("        readerThread.IsBackground = true;")

if start_idx != -1 and end_idx != -1:
    new_reader = """        Thread readerThread = new Thread(() => {
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
            RestoreCursors();
            if (_hookID != IntPtr.Zero) UnhookWindowsHookEx(_hookID);
            Environment.Exit(0);
        });\n"""
    
    content = content[:start_idx] + new_reader + content[end_idx:]
    with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\MouseBlocker.cs', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Fixed readerThread loop")
else:
    print("Could not find readerThread block")
