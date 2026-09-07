using System;
using System.Runtime.InteropServices;
public class TestWheel {
    [StructLayout(LayoutKind.Explicit)]
    public struct RAWMOUSE {
        [FieldOffset(0)]
        public ushort usFlags;
        [FieldOffset(4)]
        public uint ulButtons;
        [FieldOffset(8)]
        public uint ulRawButtons;
        [FieldOffset(12)]
        public int lLastX;
        [FieldOffset(16)]
        public int lLastY;
        [FieldOffset(20)]
        public uint ulExtraInformation;
    }
    public static void Main() {
        RAWMOUSE rm = new RAWMOUSE();
        rm.ulButtons = 0x00780400; // 0x0078 (120) in upper 16, 0x0400 in lower 16
        ushort flags = (ushort)(rm.ulButtons & 0xFFFF);
        short wheel = (short)(rm.ulButtons >> 16);
        Console.WriteLine("flags: " + flags + ", wheel: " + wheel);
    }
}
