using System;
using System.Runtime.InteropServices;
public class Mover {
    [DllImport("user32.dll")]
    public static extern void mouse_event(uint dwFlags, uint dx, uint dy, uint dwData, int dwExtraInfo);
    public static void Move() {
        mouse_event(0x0001, 10, 10, 0, 0); // MOUSEEVENTF_MOVE
    }
}
