using System;
using System.Diagnostics;
using System.Runtime.InteropServices;
using System.Windows.Forms;
public class TestRaw {
    [StructLayout(LayoutKind.Sequential)]
    public struct RAWINPUTDEVICE {
        public ushort usUsagePage;
        public ushort usUsage;
        public uint dwFlags;
        public IntPtr hwndTarget;
    }
    [DllImport("user32.dll")]
    public static extern bool RegisterRawInputDevices(RAWINPUTDEVICE[] pRawInputDevices, uint uiNumDevices, uint cbSize);
    public static void Main() {
        Form f = new Form();
        RAWINPUTDEVICE[] rid = new RAWINPUTDEVICE[1];
        rid[0].usUsagePage = 1;
        rid[0].usUsage = 2;
        rid[0].dwFlags = 0x00000100;
        rid[0].hwndTarget = f.Handle;
        bool ok = RegisterRawInputDevices(rid, 1, (uint)Marshal.SizeOf(typeof(RAWINPUTDEVICE)));
        Console.WriteLine("RegisterRawInputDevices: " + ok);
    }
}
