with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\MouseBlocker.cs', 'r', encoding='utf-8') as f:
    content = f.read()

target = "private delegate IntPtr LowLevelMouseProc(int nCode, IntPtr wParam, IntPtr lParam);"
rep = """[StructLayout(LayoutKind.Sequential)]
    private struct MSLLHOOKSTRUCT {
        public int pt_x;
        public int pt_y;
        public int mouseData;
        public int flags;
        public int time;
        public IntPtr dwExtraInfo;
    }

    private delegate IntPtr LowLevelMouseProc(int nCode, IntPtr wParam, IntPtr lParam);"""
if target in content:
    content = content.replace(target, rep)
    with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\MouseBlocker.cs', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Added MSLLHOOKSTRUCT")
else:
    print("Target not found")
