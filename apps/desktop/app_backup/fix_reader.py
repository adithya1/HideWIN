import re

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\MouseBlocker.cs', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace readerThread with a robust regex
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
        });"""

content = re.sub(r'        Thread readerThread = new Thread\(\(\) => \{.*?\Environment\.Exit\(0\);\n        \}\);', new_reader, content, flags=re.DOTALL)

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\MouseBlocker.cs', 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixed readerThread loop")
