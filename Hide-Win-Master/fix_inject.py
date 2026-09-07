with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\MouseBlocker.cs', 'r', encoding='utf-8') as f:
    content = f.read()

target = """        if (nCode >= 0 && _isLocked) {
            // Block everything only when locked!
            return (IntPtr)1; 
        }"""

rep = """        if (nCode >= 0 && _isLocked) {
            MSLLHOOKSTRUCT mouseData = (MSLLHOOKSTRUCT)Marshal.PtrToStructure(lParam, typeof(MSLLHOOKSTRUCT));
            // Allow injected events (like robotjs) to pass through so the Red Arrow can click the IDE natively!
            if ((mouseData.flags & 0x01) != 0) {
                return CallNextHookEx(_hookID, nCode, wParam, lParam);
            }
            // Block physical mouse events
            return (IntPtr)1; 
        }"""
if target in content:
    content = content.replace(target, rep)
    with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\MouseBlocker.cs', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Updated MouseBlocker to allow LLMHF_INJECTED")
else:
    print("Target not found")
