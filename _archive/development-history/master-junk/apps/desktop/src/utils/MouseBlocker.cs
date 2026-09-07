using System;
using System.Drawing;
using System.Diagnostics;
using System.Runtime.InteropServices;
using System.Windows.Forms;
using System.Collections.Concurrent;
using System.Threading;
using System.IO;

public class MouseBlocker {

    [DllImport("user32.dll")]
    public static extern bool SetSystemCursor(IntPtr hcur, uint id);
    
    [DllImport("user32.dll", CharSet = CharSet.Auto)]
    public static extern bool SystemParametersInfo(uint uiAction, uint uiParam, IntPtr pvParam, uint fWinIni);
    
    [DllImport("user32.dll")]
    public static extern IntPtr LoadCursor(IntPtr hInstance, int lpCursorName);
    
    [DllImport("user32.dll")]
    public static extern IntPtr CopyIcon(IntPtr pcur);

    public static void SetLoadingCursor() {
        IntPtr waitCursor = LoadCursor(IntPtr.Zero, 32514);
        
        SetSystemCursor(CopyIcon(waitCursor), 32512); // Arrow
        SetSystemCursor(CopyIcon(waitCursor), 32513); // IBeam
        SetSystemCursor(CopyIcon(waitCursor), 32649); // Hand
    }

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

    [StructLayout(LayoutKind.Sequential)]
    public struct RAWINPUTDEVICE {
        public ushort usUsagePage;
        public ushort usUsage;
        public uint dwFlags;
        public IntPtr hwndTarget;
    }

    [StructLayout(LayoutKind.Sequential)]
    public struct RAWINPUTHEADER {
        public uint dwType;
        public uint dwSize;
        public IntPtr hDevice;
        public IntPtr wParam;
    }

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

    [StructLayout(LayoutKind.Explicit)]
    public struct RAWINPUT {
        [FieldOffset(0)]
        public RAWINPUTHEADER header;
        [FieldOffset(24)]
        public RAWMOUSE mouse;
    }

    [DllImport("user32.dll")]
    public static extern bool RegisterRawInputDevices(RAWINPUTDEVICE[] pRawInputDevices, uint uiNumDevices, uint cbSize);
    
    [DllImport("user32.dll")]
    public static extern uint GetRawInputData(IntPtr hRawInput, uint uiCommand, out RAWINPUT pData, ref uint pcbSize, uint cbSizeHeader);

    [StructLayout(LayoutKind.Sequential)]
    private struct MSLLHOOKSTRUCT {
        public int pt_x;
        public int pt_y;
        public int mouseData;
        public int flags;
        public int time;
        public IntPtr dwExtraInfo;
    }

    private delegate IntPtr LowLevelMouseProc(int nCode, IntPtr wParam, IntPtr lParam);
    [DllImport("user32.dll")]
    private static extern IntPtr SetWindowsHookEx(int idHook, LowLevelMouseProc lpfn, IntPtr hMod, uint dwThreadId);
    [DllImport("user32.dll")]
    private static extern bool UnhookWindowsHookEx(IntPtr hhk);
    [DllImport("user32.dll")]
    private static extern IntPtr CallNextHookEx(IntPtr hhk, int nCode, IntPtr wParam, IntPtr lParam);
    [DllImport("kernel32.dll")]
    private static extern IntPtr GetModuleHandle(string lpModuleName);

    private const uint RIDEV_INPUTSINK = 0x00000100;
    private const uint RID_INPUT = 0x10000003;
    private const uint RIM_TYPEMOUSE = 0;
    private const int WM_INPUT = 0x00FF;

    private const ushort RI_MOUSE_WHEEL = 0x0400;
    private const ushort RI_MOUSE_LEFT_BUTTON_DOWN = 0x0001;
    private const ushort RI_MOUSE_LEFT_BUTTON_UP = 0x0002;
    private const ushort RI_MOUSE_RIGHT_BUTTON_DOWN = 0x0004;
    private const ushort RI_MOUSE_RIGHT_BUTTON_UP = 0x0008;

    private static volatile int netDX = 0;
    private static volatile int netDY = 0;
    private static volatile bool _running = true;
    private static volatile bool _isLocked = false;
    [StructLayout(LayoutKind.Sequential)]
    public struct CURSORINFO {
        public int cbSize;
        public int flags;
        public IntPtr hCursor;
        public int ptScreenPos_x;
        public int ptScreenPos_y;
    }

    [DllImport("user32.dll")]
    public static extern bool GetCursorInfo(out CURSORINFO pci);

    [DllImport("user32.dll")]
    public static extern IntPtr SetCursor(IntPtr hCursor);

    [DllImport("user32.dll")]
    static extern void mouse_event(uint dwFlags, uint dx, uint dy, uint dwData, int dwExtraInfo);
    [DllImport("user32.dll")]
    [return: MarshalAs(UnmanagedType.Bool)]
    static extern bool SetCursorPos(int X, int Y);
    private const uint MOUSEEVENTF_LEFTDOWN = 0x0002;
    private const uint MOUSEEVENTF_LEFTUP = 0x0004;
    private const uint MOUSEEVENTF_RIGHTDOWN = 0x0008;
    private const uint MOUSEEVENTF_RIGHTUP = 0x0010;
    private const uint MOUSEEVENTF_WHEEL = 0x0800;

    private static IntPtr _frozenCursor = IntPtr.Zero;
    private static IntPtr _hookID = IntPtr.Zero;

    private static BlockingCollection<string> _queue = new BlockingCollection<string>(4096);

    public class MessageWindow : Form {
        public MessageWindow(int x, int y) {
            this.FormBorderStyle = FormBorderStyle.None;
            this.StartPosition = FormStartPosition.Manual;
            this.Location = new System.Drawing.Point(x - 16, y - 16);
            this.Size = new System.Drawing.Size(32, 32);
            this.Region = new System.Drawing.Region(new System.Drawing.Rectangle(0, 0, 32, 32)); // 32x32 to catch all cursor hotspots
            this.TopMost = true;
            this.ShowInTaskbar = false;
            
            this.BackColor = Color.Black;
            this.Opacity = 0.004; // Mathematically invisible
        }

        protected override CreateParams CreateParams {
            get {
                CreateParams cp = base.CreateParams;
                cp.ExStyle |= 0x08000000; // WS_EX_NOACTIVATE
                cp.ClassStyle &= ~0x00020000; // CS_DROPSHADOW
                return cp;
            }
        }

        protected override void WndProc(ref Message m) {
            if (m.Msg == WM_INPUT) {
                uint dwSize = 48; 
                RAWINPUT raw = new RAWINPUT();
                uint headerSize = 24;
                if (GetRawInputData(m.LParam, RID_INPUT, out raw, ref dwSize, headerSize) != unchecked((uint)-1)) {
                    if (raw.header.dwType == RIM_TYPEMOUSE) {
                        int dx = raw.mouse.lLastX;
                        int dy = raw.mouse.lLastY;
                        
                        if ((raw.mouse.usFlags & 0x01) == 0 && (dx != 0 || dy != 0)) {
                            // Accumulate natively, throttled by the throttleThread
                            Interlocked.Add(ref netDX, dx);
                            Interlocked.Add(ref netDY, dy);
                        }

                        uint buttons = raw.mouse.ulButtons;
                        if ((buttons & RI_MOUSE_LEFT_BUTTON_DOWN) != 0) _queue.TryAdd("LDOWN");
                        if ((buttons & RI_MOUSE_LEFT_BUTTON_UP) != 0) _queue.TryAdd("LUP");
                        if ((buttons & RI_MOUSE_RIGHT_BUTTON_DOWN) != 0) _queue.TryAdd("RDOWN");
                        if ((buttons & RI_MOUSE_RIGHT_BUTTON_UP) != 0) _queue.TryAdd("RUP");
                        
                        if ((buttons & RI_MOUSE_WHEEL) != 0) {
                            short wheelDelta = (short)(buttons >> 16);
                            _queue.TryAdd(string.Format("WHEEL:{0}", wheelDelta));
                        }
                    }
                }
            } else if (m.Msg == 0x020A || m.Msg == 0x0200 || m.Msg == 0x0201 || m.Msg == 0x0204 || m.Msg == 0x020E) {
                // Swallow WM_MOUSEWHEEL, WM_MOUSEMOVE, WM_LBUTTONDOWN, WM_RBUTTONDOWN, WM_MOUSEHWHEEL
                m.Result = IntPtr.Zero;
                return;
            } else if (m.Msg == 0x0020) { // WM_SETCURSOR
                if (_frozenCursor != IntPtr.Zero) {
                    SetCursor(_frozenCursor);
                    m.Result = (IntPtr)1;
                    return;
                }
                m.Result = (IntPtr)1;
                return;
            }
            base.WndProc(ref m);
        }
    }

    private static IntPtr HookCallback(int nCode, IntPtr wParam, IntPtr lParam) {
        if (nCode >= 0 && _isLocked) {
            MSLLHOOKSTRUCT mouseData = (MSLLHOOKSTRUCT)Marshal.PtrToStructure(lParam, typeof(MSLLHOOKSTRUCT));
            // Allow injected events (like robotjs) to pass through so the Red Arrow can click the IDE natively!
            if ((mouseData.flags & 0x01) != 0) {
                return CallNextHookEx(_hookID, nCode, wParam, lParam);
            }
            // Block physical mouse events
            return (IntPtr)1; 
        }
        return CallNextHookEx(_hookID, nCode, wParam, lParam);
    }

    private static LowLevelMouseProc _hookDelegate;

    [STAThread]
    public static void Main(string[] args) {
        int frozenX = 0, frozenY = 0;
        if (args.Length >= 2) {
            int.TryParse(args[0], out frozenX);
            int.TryParse(args[1], out frozenY);
        }

        CURSORINFO pci = new CURSORINFO();
        pci.cbSize = Marshal.SizeOf(typeof(CURSORINFO));
        if (GetCursorInfo(out pci)) {
            _frozenCursor = pci.hCursor;
        }

        // We throttle MOVE events to ~125Hz to prevent Node.js IPC from choking (fixing the 2-second delay)
        Thread throttleThread = new Thread(() => {
            int lastX = 0;
            int lastY = 0;
            while (_running) {
                int curX = netDX;
                int curY = netDY;
                if (curX != lastX || curY != lastY) {
                    _queue.TryAdd(string.Format("MOVE:{0},{1}", curX, curY));
                    lastX = curX;
                    lastY = curY;
                }
                Thread.Sleep(8); // ~125 Hz
            }
        });
        throttleThread.IsBackground = true;
        throttleThread.Start();

        Thread writerThread = new Thread(() => {
            StreamWriter sw = new StreamWriter(Console.OpenStandardOutput());
            sw.AutoFlush = true;
            sw.WriteLine("STARTED");
            try {
                foreach (string msg in _queue.GetConsumingEnumerable()) {
                    sw.WriteLine(msg);
                }
            } catch (Exception) { } // Catch any IOException to prevent crash
        });
        writerThread.IsBackground = true;
        writerThread.Start();

        Thread readerThread = new Thread(() => {
            while (true) {
                try {
                    string line = Console.ReadLine();
                    if (line == null) break;
                    line = line.Trim();
                    if (line.StartsWith("LOCK")) { netDX = 0; netDY = 0; _isLocked = true; }
                    else if (line.StartsWith("UNLOCK")) { 
                        _isLocked = false; 
                        mouse_event(MOUSEEVENTF_LEFTUP | MOUSEEVENTF_RIGHTUP, 0, 0, 0, 0);
                    }
                    else if (line == "EXIT") break;
                    else if (line.StartsWith("CLICK:")) {
                        try {
                            string[] parts = line.Substring(6).Split(',');
                            int x = int.Parse(parts[0]);
                            int y = int.Parse(parts[1]);
                            string action = parts[2];
                            string button = parts[3];
                            int fX = int.Parse(parts[4]);
                            int fY = int.Parse(parts[5]);
                            SetCursorPos(x, y);
                            uint flag = 0;
                            if (button == "left") flag = (action == "down") ? MOUSEEVENTF_LEFTDOWN : MOUSEEVENTF_LEFTUP;
                            else flag = (action == "down") ? MOUSEEVENTF_RIGHTDOWN : MOUSEEVENTF_RIGHTUP;
                            mouse_event(flag, 0, 0, 0, 0);
                            SetCursorPos(fX, fY);
                        } catch {}
                    }
                    else if (line.StartsWith("SCROLL:")) {
                        try {
                            string[] parts = line.Substring(7).Split(',');
                            int notches = int.Parse(parts[0]);
                            int x = int.Parse(parts[1]);
                            int y = int.Parse(parts[2]);
                            int fX = int.Parse(parts[3]);
                            int fY = int.Parse(parts[4]);
                            SetCursorPos(x, y);
                            mouse_event(MOUSEEVENTF_WHEEL, 0, 0, (uint)(notches * 120), 0);
                            SetCursorPos(fX, fY);
                        } catch {}
                    }
                } catch { break; }
            }
            _running = false;
            RestoreCursors();
            if (_hookID != IntPtr.Zero) UnhookWindowsHookEx(_hookID);
            Environment.Exit(0);
        });
        readerThread.IsBackground = true;
        readerThread.Start();

        // Assign delegate to a static field so the GC never collects it!
        _hookDelegate = HookCallback;

        using (Process p = Process.GetCurrentProcess())
        using (ProcessModule m = p.MainModule) {
            _hookID = SetWindowsHookEx(14, _hookDelegate, GetModuleHandle(m.ModuleName), 0);
        }

        MessageWindow wnd = new MessageWindow(frozenX, frozenY);
        RAWINPUTDEVICE[] rid = new RAWINPUTDEVICE[1];
        rid[0].usUsagePage = 0x01;
        rid[0].usUsage = 0x02; 
        rid[0].dwFlags = RIDEV_INPUTSINK; 
        rid[0].hwndTarget = wnd.Handle;
        
        RegisterRawInputDevices(rid, 1, (uint)Marshal.SizeOf(typeof(RAWINPUTDEVICE)));

        // SetLoadingCursor(); // Reverted back to normal frozen arrow
        
        // OVERWRITE the loading spinners with the normal arrow!
        IntPtr arrow = LoadCursor(IntPtr.Zero, 32512);
        SetSystemCursor(CopyIcon(arrow), 32514); // IDC_WAIT
        SetSystemCursor(CopyIcon(arrow), 32650); // IDC_APPSTARTING
        
        Application.Run(wnd);

        _running = false;
        RestoreCursors();
        if (_hookID != IntPtr.Zero) UnhookWindowsHookEx(_hookID);
        _queue.CompleteAdding();
        writerThread.Join(1000);
    }
}
