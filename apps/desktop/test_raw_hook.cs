using System;
using System.Runtime.InteropServices;
using System.Windows.Forms;
public class TestRawHook {
    [StructLayout(LayoutKind.Sequential)]
    public struct RAWINPUTDEVICE {
        public ushort usUsagePage;
        public ushort usUsage;
        public uint dwFlags;
        public IntPtr hwndTarget;
    }
    [DllImport("user32.dll")]
    public static extern bool RegisterRawInputDevices(RAWINPUTDEVICE[] pRawInputDevices, uint uiNumDevices, uint cbSize);
    
    private delegate IntPtr LowLevelMouseProc(int nCode, IntPtr wParam, IntPtr lParam);
    [DllImport("user32.dll")]
    private static extern IntPtr SetWindowsHookEx(int idHook, LowLevelMouseProc lpfn, IntPtr hMod, uint dwThreadId);
    [DllImport("kernel32.dll")]
    private static extern IntPtr GetModuleHandle(string lpModuleName);
    [DllImport("user32.dll")]
    private static extern bool UnhookWindowsHookEx(IntPtr hhk);

    public static void Main() {
        Form f = new Form();
        RAWINPUTDEVICE[] rid = new RAWINPUTDEVICE[1];
        rid[0].usUsagePage = 1;
        rid[0].usUsage = 2;
        rid[0].dwFlags = 0x00000100;
        rid[0].hwndTarget = f.Handle;
        RegisterRawInputDevices(rid, 1, (uint)Marshal.SizeOf(typeof(RAWINPUTDEVICE)));
        
        using (System.Diagnostics.Process p = System.Diagnostics.Process.GetCurrentProcess())
        using (System.Diagnostics.ProcessModule m = p.MainModule) {
            SetWindowsHookEx(14, (nCode, wParam, lParam) => { return (IntPtr)1; }, GetModuleHandle(m.ModuleName), 0);
        }
        
        // Let's just output "OK" so we know it compiles and runs.
        Console.WriteLine("OK");
        Environment.Exit(0);
    }
}
