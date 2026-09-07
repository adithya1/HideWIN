using System;
using System.Diagnostics;
using System.Runtime.InteropServices;
public class TestPt {
    private delegate IntPtr LowLevelMouseProc(int nCode, IntPtr wParam, IntPtr lParam);
    private static LowLevelMouseProc _proc = HookCallback;

    [StructLayout(LayoutKind.Sequential)]
    public struct POINT { public int x; public int y; }

    [StructLayout(LayoutKind.Sequential)]
    public struct MSLLHOOKSTRUCT {
        public POINT pt;
        public int mouseData;
        public int flags;
        public int time;
        public IntPtr dwExtraInfo;
    }

    [DllImport("user32.dll")]
    private static extern IntPtr SetWindowsHookEx(int idHook, LowLevelMouseProc lpfn, IntPtr hMod, uint dwThreadId);
    [DllImport("kernel32.dll")]
    private static extern IntPtr GetModuleHandle(string lpModuleName);
    [DllImport("user32.dll")]
    private static extern bool UnhookWindowsHookEx(IntPtr hhk);

    public static void Main() {
        using (Process p = Process.GetCurrentProcess())
        using (ProcessModule m = p.MainModule) {
            IntPtr handle = GetModuleHandle(m.ModuleName);
            IntPtr hook = SetWindowsHookEx(14, _proc, handle, 0);
            System.Windows.Forms.Application.Run();
        }
    }
    private static IntPtr HookCallback(int nCode, IntPtr wParam, IntPtr lParam) {
        if (nCode >= 0 && wParam == (IntPtr)0x0200) {
            MSLLHOOKSTRUCT hs = (MSLLHOOKSTRUCT)Marshal.PtrToStructure(lParam, typeof(MSLLHOOKSTRUCT));
            Console.WriteLine("pt: " + hs.pt.x + ", " + hs.pt.y);
            Environment.Exit(0);
        }
        return IntPtr.Zero;
    }
}
