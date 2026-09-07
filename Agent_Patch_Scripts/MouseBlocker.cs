using System;
using System.Collections.Concurrent;
using System.Diagnostics;
using System.Runtime.InteropServices;
using System.Threading;

class MouseBlocker
{
    private const int WH_MOUSE_LL = 14;
    private const int WM_MOUSEMOVE = 0x0200;
    private const int WM_LBUTTONDOWN = 0x0201;
    private const int WM_LBUTTONUP = 0x0202;
    private const int WM_RBUTTONDOWN = 0x0204;
    private const int WM_RBUTTONUP = 0x0205;
    private const int WM_MOUSEWHEEL = 0x020A;
    private const int DPI_AWARENESS_CONTEXT_PER_MONITOR_AWARE_V2 = -4;

    [StructLayout(LayoutKind.Sequential)]
    public struct POINT { public int x; public int y; }

    [StructLayout(LayoutKind.Sequential)]
    public struct MSLLHOOKSTRUCT { public POINT pt; public uint mouseData; public uint flags; public uint time; public IntPtr dwExtraInfo; }
    
    [StructLayout(LayoutKind.Sequential)]
    public struct MSG { public IntPtr hwnd; public uint message; public IntPtr wParam; public IntPtr lParam; public uint time; public POINT pt; }

    [DllImport("user32.dll")]
    private static extern bool SetProcessDpiAwarenessContext(int value);

    [DllImport("user32.dll")]
    private static extern bool SetProcessDPIAware();

    [DllImport("user32.dll", CharSet = CharSet.Auto, SetLastError = true)]
    private static extern IntPtr SetWindowsHookEx(int idHook, LowLevelMouseProc lpfn, IntPtr hMod, uint dwThreadId);

    [DllImport("user32.dll", CharSet = CharSet.Auto, SetLastError = true)]
    [return: MarshalAs(UnmanagedType.Bool)]
    private static extern bool UnhookWindowsHookEx(IntPtr hhk);

    [DllImport("user32.dll", CharSet = CharSet.Auto, SetLastError = true)]
    private static extern IntPtr CallNextHookEx(IntPtr hhk, int nCode, IntPtr wParam, IntPtr lParam);

    [DllImport("kernel32.dll", CharSet = CharSet.Auto, SetLastError = true)]
    private static extern IntPtr GetModuleHandle(string lpModuleName);
    
    [DllImport("user32.dll")]
    private static extern bool SetCursorPos(int X, int Y);
    
    [DllImport("user32.dll")]
    private static extern bool GetCursorPos(out POINT lpPoint);

    [DllImport("user32.dll")]
    private static extern int GetMessage(out MSG lpMsg, IntPtr hWnd, uint wMsgFilterMin, uint wMsgFilterMax);

    [DllImport("user32.dll")]
    private static extern bool TranslateMessage(ref MSG lpMsg);

    [DllImport("user32.dll")]
    private static extern IntPtr DispatchMessage(ref MSG lpMsg);

    [DllImport("user32.dll")]
    private static extern void PostQuitMessage(int nExitCode);

    private delegate IntPtr LowLevelMouseProc(int nCode, IntPtr wParam, IntPtr lParam);
    
    private static LowLevelMouseProc _proc = HookCallback;
    private static IntPtr _hookID = IntPtr.Zero;

    private static int _frozenX = 0;
    private static int _frozenY = 0;
    
    private static int _dx = 0;
    private static int _dy = 0;

    private static ConcurrentQueue<string> _outputQueue = new ConcurrentQueue<string>();
    private static volatile bool _running = true;

    static void Main(string[] args)
    {
        try { SetProcessDpiAwarenessContext(DPI_AWARENESS_CONTEXT_PER_MONITOR_AWARE_V2); } catch {}
        try { SetProcessDPIAware(); } catch {}

        POINT pt;
        if (GetCursorPos(out pt))
        {
            _frozenX = pt.x;
            _frozenY = pt.y;
        }

        Thread outThread = new Thread(new ThreadStart(OutputLoop));
        outThread.IsBackground = true;
        outThread.Start();
        
        Thread readThread = new Thread(new ThreadStart(ReadLoop));
        readThread.IsBackground = true;
        readThread.Start();

        _hookID = SetHook(_proc);
        
        Console.WriteLine("STARTED");
        Console.Out.Flush();

        MSG msg;
        while (GetMessage(out msg, IntPtr.Zero, 0, 0) > 0)
        {
            TranslateMessage(ref msg);
            DispatchMessage(ref msg);
        }

        UnhookWindowsHookEx(_hookID);
    }
    
    private static void ReadLoop()
    {
        string line;
        while ((line = Console.ReadLine()) != null)
        {
            if (line == "EXIT") break;
        }
        _running = false;
        PostQuitMessage(0);
    }
    
    private static void OutputLoop()
    {
        while (_running)
        {
            string msg;
            if (_outputQueue.TryDequeue(out msg))
            {
                Console.WriteLine(msg);
                Console.Out.Flush();
            }
            else
            {
                Thread.Sleep(1);
            }
        }
    }

    private static IntPtr SetHook(LowLevelMouseProc proc)
    {
        using (Process curProcess = Process.GetCurrentProcess())
        using (ProcessModule curModule = curProcess.MainModule)
        {
            return SetWindowsHookEx(WH_MOUSE_LL, proc, GetModuleHandle(curModule.ModuleName), 0);
        }
    }

    private static IntPtr HookCallback(int nCode, IntPtr wParam, IntPtr lParam)
    {
        if (nCode >= 0)
        {
            int msg = wParam.ToInt32();
            MSLLHOOKSTRUCT hookStruct = (MSLLHOOKSTRUCT)Marshal.PtrToStructure(lParam, typeof(MSLLHOOKSTRUCT));

            if (msg == WM_MOUSEMOVE)
            {
                // Accept EXACT match as injected SetCursorPos
                if (hookStruct.pt.x == _frozenX && hookStruct.pt.y == _frozenY)
                {
                    return CallNextHookEx(_hookID, nCode, wParam, lParam);
                }

                int moveX = hookStruct.pt.x - _frozenX;
                int moveY = hookStruct.pt.y - _frozenY;
                
                if (moveX != 0 || moveY != 0)
                {
                    _dx += moveX;
                    _dy += moveY;
                    _outputQueue.Enqueue(string.Format("MOVE:{0},{1}", _dx, _dy));
                    SetCursorPos(_frozenX, _frozenY);
                }
                return (IntPtr)1;
            }
            else if (msg == WM_LBUTTONDOWN)
            {
                _outputQueue.Enqueue("LDOWN");
                return (IntPtr)1;
            }
            else if (msg == WM_RBUTTONDOWN)
            {
                _outputQueue.Enqueue("RDOWN");
                return (IntPtr)1;
            }
            else if (msg == WM_MOUSEWHEEL)
            {
                int delta = (short)((hookStruct.mouseData >> 16) & 0xffff);
                _outputQueue.Enqueue(string.Format("WHEEL:{0}", delta));
                return (IntPtr)1;
            }
            else if (msg == WM_LBUTTONUP || msg == WM_RBUTTONUP)
            {
                return (IntPtr)1;
            }
        }
        return CallNextHookEx(_hookID, nCode, wParam, lParam);
    }
}
