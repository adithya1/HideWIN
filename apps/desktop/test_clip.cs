using System;
using System.Runtime.InteropServices;
public class TestClip {
    [StructLayout(LayoutKind.Sequential)]
    public struct RECT {
        public int Left;
        public int Top;
        public int Right;
        public int Bottom;
    }
    [DllImport("user32.dll")]
    public static extern bool ClipCursor(ref RECT lpRect);
    [DllImport("user32.dll")]
    public static extern bool ClipCursor(IntPtr lpRect);
    
    public static void Main() {
        RECT r = new RECT();
        r.Left = 500;
        r.Top = 500;
        r.Right = 501;
        r.Bottom = 501;
        bool ok = ClipCursor(ref r);
        Console.WriteLine("ClipCursor: " + ok);
        System.Threading.Thread.Sleep(2000);
        ClipCursor(IntPtr.Zero);
    }
}
