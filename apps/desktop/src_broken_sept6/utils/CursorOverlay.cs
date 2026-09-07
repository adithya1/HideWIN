using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;
using System.Windows.Forms;
using System.IO;
using System.Diagnostics;

public class CursorOverlay : Form {
    [DllImport("user32.dll")] public static extern uint SetWindowDisplayAffinity(IntPtr hWnd, uint dwAffinity);
    [DllImport("user32.dll")] static extern bool GetCursorPos(out POINT lpPoint);
    [StructLayout(LayoutKind.Sequential)] public struct POINT { public int x; public int y; }
    [DllImport("user32.dll", ExactSpelling = true, SetLastError = true)] static extern bool UpdateLayeredWindow(IntPtr hwnd, IntPtr hdcDst, ref POINT pptDst, ref SIZE psize, IntPtr hdcSrc, ref POINT pprSrc, Int32 crKey, ref BLENDFUNCTION pblend, Int32 dwFlags);
    [DllImport("user32.dll")] static extern IntPtr GetDC(IntPtr hWnd);
    [DllImport("user32.dll")] static extern int ReleaseDC(IntPtr hWnd, IntPtr hDC);
    [DllImport("gdi32.dll")] static extern IntPtr CreateCompatibleDC(IntPtr hDC);
    [DllImport("gdi32.dll")] static extern bool DeleteDC(IntPtr hdc);
    [DllImport("gdi32.dll")] static extern IntPtr SelectObject(IntPtr hDC, IntPtr hObject);
    [DllImport("gdi32.dll")] static extern bool DeleteObject(IntPtr hObject);
    [StructLayout(LayoutKind.Sequential)] public struct SIZE { public int cx; public int cy; }
    [StructLayout(LayoutKind.Sequential)] public struct BLENDFUNCTION { public byte BlendOp; public byte BlendFlags; public byte SourceConstantAlpha; public byte AlphaFormat; }

    const int ULW_ALPHA = 2;
    const byte AC_SRC_OVER = 0x00;
    const byte AC_SRC_ALPHA = 0x01;

    // Mouse Hook
    [DllImport("user32.dll", CharSet = CharSet.Auto, SetLastError = true)]
    private static extern IntPtr SetWindowsHookEx(int idHook, LowLevelMouseProc lpfn, IntPtr hMod, uint dwThreadId);
    [DllImport("user32.dll", CharSet = CharSet.Auto, SetLastError = true)]
    [return: MarshalAs(UnmanagedType.Bool)]
    private static extern bool UnhookWindowsHookEx(IntPtr hhk);
    [DllImport("user32.dll", CharSet = CharSet.Auto, SetLastError = true)]
    private static extern IntPtr CallNextHookEx(IntPtr hhk, int nCode, IntPtr wParam, IntPtr lParam);
    [DllImport("kernel32.dll", CharSet = CharSet.Auto, SetLastError = true)]
    private static extern IntPtr GetModuleHandle(string lpModuleName);

    private delegate IntPtr LowLevelMouseProc(int nCode, IntPtr wParam, IntPtr lParam);
    private static LowLevelMouseProc _proc = HookCallback;
    private static IntPtr _hookID = IntPtr.Zero;

    private const int WH_MOUSE_LL = 14;
    private const int WM_LBUTTONDOWN = 0x0201;

    protected override CreateParams CreateParams {
        get {
            CreateParams cp = base.CreateParams;
            cp.ExStyle |= 0x80000; // WS_EX_LAYERED
            cp.ExStyle |= 0x20; // WS_EX_TRANSPARENT (Click-through)
            cp.ExStyle |= 0x80; // WS_EX_TOOLWINDOW
            return cp;
        }
    }

    Timer timer;
    Bitmap cursorBitmap;
    int hotspotX = 0;
    int hotspotY = 0;
    int lastX = -1;
    int lastY = -1;

    public CursorOverlay(string imgPath, int hx, int hy) {
        this.FormBorderStyle = FormBorderStyle.None;
        this.TopMost = true;
        this.ShowInTaskbar = false;
        this.StartPosition = FormStartPosition.Manual;
        
        hotspotX = hx;
        hotspotY = hy;
        
        try {
            using (Icon ico = new Icon(imgPath)) {
                cursorBitmap = new Bitmap(ico.Width, ico.Height, PixelFormat.Format32bppArgb);
                using (Graphics g = Graphics.FromImage(cursorBitmap)) {
                    g.DrawIcon(ico, new Rectangle(0, 0, ico.Width, ico.Height));
                }
            }
        } catch {
            cursorBitmap = new Bitmap(16, 16, PixelFormat.Format32bppArgb);
            using (Graphics g = Graphics.FromImage(cursorBitmap)) {
                g.Clear(Color.Red);
            }
        }
        
        this.Size = new Size(cursorBitmap.Width, cursorBitmap.Height);
        
        _hookID = SetHook(_proc);
        
        timer = new Timer();
        timer.Interval = 10;
        timer.Tick += UpdateOverlay;
        timer.Start();
    }

    protected override void OnHandleCreated(EventArgs e) {
        base.OnHandleCreated(e);
        SetWindowDisplayAffinity(this.Handle, 0x00000011); // WDA_EXCLUDEFROMCAPTURE
    }

    protected override void OnFormClosed(FormClosedEventArgs e) {
        UnhookWindowsHookEx(_hookID);
        base.OnFormClosed(e);
    }

    void UpdateOverlay(object sender, EventArgs e) {
        POINT p;
        GetCursorPos(out p);
        SetBitmap(cursorBitmap, p.x - hotspotX, p.y - hotspotY);
        
        if (p.x != lastX || p.y != lastY) {
            Console.WriteLine(string.Format("MOVE:{0},{1}", p.x, p.y));
            lastX = p.x;
            lastY = p.y;
        }
    }

    void SetBitmap(Bitmap bitmap, int x, int y) {
        IntPtr screenDc = GetDC(IntPtr.Zero);
        IntPtr memDc = CreateCompatibleDC(screenDc);
        IntPtr hBitmap = IntPtr.Zero;
        IntPtr oldBitmap = IntPtr.Zero;

        try {
            hBitmap = bitmap.GetHbitmap(Color.FromArgb(0));
            oldBitmap = SelectObject(memDc, hBitmap);
            
            SIZE size = new SIZE() { cx = bitmap.Width, cy = bitmap.Height };
            POINT pointSource = new POINT() { x = 0, y = 0 };
            POINT topPos = new POINT() { x = x, y = y };
            BLENDFUNCTION blend = new BLENDFUNCTION();
            blend.BlendOp = AC_SRC_OVER;
            blend.BlendFlags = 0;
            blend.SourceConstantAlpha = 255;
            blend.AlphaFormat = AC_SRC_ALPHA;

            UpdateLayeredWindow(this.Handle, screenDc, ref topPos, ref size, memDc, ref pointSource, 0, ref blend, ULW_ALPHA);
        }
        finally {
            ReleaseDC(IntPtr.Zero, screenDc);
            if (hBitmap != IntPtr.Zero) {
                SelectObject(memDc, oldBitmap);
                DeleteObject(hBitmap);
            }
            DeleteDC(memDc);
        }
    }
    
    private static IntPtr SetHook(LowLevelMouseProc proc) {
        using (Process curProcess = Process.GetCurrentProcess())
        using (ProcessModule curModule = curProcess.MainModule) {
            return SetWindowsHookEx(WH_MOUSE_LL, proc, GetModuleHandle(curModule.ModuleName), 0);
        }
    }

    private static IntPtr HookCallback(int nCode, IntPtr wParam, IntPtr lParam) {
        if (nCode >= 0 && wParam == (IntPtr)WM_LBUTTONDOWN) {
            POINT p;
            GetCursorPos(out p);
            Console.WriteLine(string.Format("DOWN:{0},{1}", p.x, p.y));
        }
        return CallNextHookEx(_hookID, nCode, wParam, lParam);
    }
    
    public static void Main(string[] args) {
        string imgPath = "cursor.ico";
        int hx = 0;
        int hy = 0;
        
        if (args.Length >= 1) imgPath = args[0];
        if (args.Length >= 2) int.TryParse(args[1], out hx);
        if (args.Length >= 3) int.TryParse(args[2], out hy);
        
        Application.Run(new CursorOverlay(imgPath, hx, hy));
    }
}
