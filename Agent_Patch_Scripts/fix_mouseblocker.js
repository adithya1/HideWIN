const fs = require('fs');
const path = require('path');
const p = path.join('C:', 'Users', 'akula', 'Downloads', 'Hide-WIN', 'Hide-Win-Master', 'src', 'utils', 'MouseBlocker.cs');
let text = fs.readFileSync(p, 'utf8');

const injection = `
    [DllImport("user32.dll")]
    public static extern bool SetSystemCursor(IntPtr hcur, uint id);
    
    [DllImport("user32.dll", CharSet = CharSet.Auto)]
    public static extern bool SystemParametersInfo(uint uiAction, uint uiParam, IntPtr pvParam, uint fWinIni);
    
    [DllImport("user32.dll")]
    public static extern IntPtr CreateCursor(IntPtr hInst, int xHotSpot, int yHotSpot, int nWidth, int nHeight, byte[] pvANDPlane, byte[] pvXORPlane);

    public const uint SPI_SETCURSORS = 0x0057;
    public static uint[] CursorIDs = { 32512, 32513, 32514, 32515, 32516, 32642, 32643, 32644, 32645, 32646, 32648, 32649, 32650, 32651 };

    public static void HideCursors() {
        byte[] andMask = new byte[128];
        byte[] xorMask = new byte[128];
        for (int i = 0; i < 128; i++) andMask[i] = 0xFF; // fully transparent

        foreach (uint id in CursorIDs) {
            IntPtr blank = CreateCursor(IntPtr.Zero, 0, 0, 32, 32, andMask, xorMask);
            SetSystemCursor(blank, id);
        }
    }

    public static void RestoreCursors() {
        SystemParametersInfo(SPI_SETCURSORS, 0, IntPtr.Zero, 0);
    }
`;

if (!text.includes("HideCursors()")) {
    text = text.replace("public class MouseBlocker {", "public class MouseBlocker {\n" + injection);
    
    text = text.replace("Application.Run(wnd);", "HideCursors();\n        Application.Run(wnd);");
    
    // Add RestoreCursors to all exits
    text = text.replace("if (_hookID != IntPtr.Zero) UnhookWindowsHookEx(_hookID);\n            Environment.Exit(0);", "RestoreCursors();\n            if (_hookID != IntPtr.Zero) UnhookWindowsHookEx(_hookID);\n            Environment.Exit(0);");
    
    text = text.replace("if (_hookID != IntPtr.Zero) UnhookWindowsHookEx(_hookID);\n        _queue.CompleteAdding();", "RestoreCursors();\n        if (_hookID != IntPtr.Zero) UnhookWindowsHookEx(_hookID);\n        _queue.CompleteAdding();");

    fs.writeFileSync(p, text, 'utf8');
    console.log("Injected system-wide cursor hiding into MouseBlocker.cs!");
}
