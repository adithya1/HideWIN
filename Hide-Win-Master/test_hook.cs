using System;
using System.Diagnostics;
using System.Runtime.InteropServices;
public class TestHook {
    [DllImport("user32.dll")]
    private static extern IntPtr SetWindowsHookEx(int idHook, IntPtr lpfn, IntPtr hMod, uint dwThreadId);
    [DllImport("kernel32.dll")]
    private static extern IntPtr GetModuleHandle(string lpModuleName);
    public static void Main() {
        using (Process p = Process.GetCurrentProcess())
        using (ProcessModule m = p.MainModule) {
            IntPtr handle = GetModuleHandle(m.ModuleName);
            IntPtr hook = SetWindowsHookEx(14, IntPtr.Zero, handle, 0); // 14 is WH_MOUSE_LL
            Console.WriteLine("Hook result: " + hook);
            if (hook == IntPtr.Zero) {
                Console.WriteLine("Error: " + Marshal.GetLastWin32Error());
            }
        }
    }
}
