using System;
using System.Diagnostics;
using System.Runtime.InteropServices;
public class TestValidHook {
    private delegate IntPtr LowLevelMouseProc(int nCode, IntPtr wParam, IntPtr lParam);
    private static LowLevelMouseProc _proc = HookCallback;

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
            IntPtr hook = SetWindowsHookEx(14, _proc, handle, 0); // 14 is WH_MOUSE_LL
            Console.WriteLine("Hook result with valid callback: " + hook);
            if (hook == IntPtr.Zero) {
                Console.WriteLine("Error: " + Marshal.GetLastWin32Error());
            } else {
                UnhookWindowsHookEx(hook);
            }
        }
    }
    private static IntPtr HookCallback(int nCode, IntPtr wParam, IntPtr lParam) {
        return IntPtr.Zero;
    }
}
