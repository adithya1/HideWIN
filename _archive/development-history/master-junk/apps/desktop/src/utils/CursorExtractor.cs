using System;
using System.Drawing;
using System.Runtime.InteropServices;
using System.IO;
using System.Windows.Media.Imaging;
using System.Windows;
using System.Windows.Interop;

public class CursorExtractor {
    [StructLayout(LayoutKind.Sequential)]
    struct POINT { public Int32 x; public Int32 y; }

    [StructLayout(LayoutKind.Sequential)]
    struct CURSORINFO { public Int32 cbSize; public Int32 flags; public IntPtr hCursor; public POINT ptScreenPos; }

    [DllImport("user32.dll")]
    static extern bool GetCursorInfo(out CURSORINFO pci);

    [DllImport("user32.dll")]
    static extern bool GetIconInfo(IntPtr hIcon, out ICONINFO piconinfo);

    [StructLayout(LayoutKind.Sequential)]
    public struct ICONINFO { public bool fIcon; public int xHotspot; public int yHotspot; public IntPtr hbmMask; public IntPtr hbmColor; }

    [DllImport("gdi32.dll")]
    static extern bool DeleteObject(IntPtr hObject);

    public static void Main() {
        System.Threading.Thread.Sleep(500);

        CURSORINFO pci;
        pci.cbSize = Marshal.SizeOf(typeof(CURSORINFO));
        if (GetCursorInfo(out pci)) {
            if (pci.flags == 0x00000001) { 
                ICONINFO iconInfo;
                if (GetIconInfo(pci.hCursor, out iconInfo)) {
                    try {
                        using (Icon icon = Icon.FromHandle(pci.hCursor)) {
                            BitmapSource src = Imaging.CreateBitmapSourceFromHIcon(icon.Handle, Int32Rect.Empty, BitmapSizeOptions.FromEmptyOptions());
                            int width = src.PixelWidth;
                            int height = src.PixelHeight;
                            
                            using (MemoryStream ms = new MemoryStream()) {
                                PngBitmapEncoder encoder = new PngBitmapEncoder();
                                encoder.Frames.Add(BitmapFrame.Create(src));
                                encoder.Save(ms);
                                Console.WriteLine(Convert.ToBase64String(ms.ToArray()) + "|" + iconInfo.xHotspot + "|" + iconInfo.yHotspot + "|" + width + "|" + height);
                            }
                        }
                    } catch (Exception) {
                        Console.WriteLine("ERROR");
                    } finally {
                        if (iconInfo.hbmColor != IntPtr.Zero) DeleteObject(iconInfo.hbmColor);
                        if (iconInfo.hbmMask != IntPtr.Zero) DeleteObject(iconInfo.hbmMask);
                    }
                    return;
                }
            }
        }
        Console.WriteLine("ERROR");
    }
}
