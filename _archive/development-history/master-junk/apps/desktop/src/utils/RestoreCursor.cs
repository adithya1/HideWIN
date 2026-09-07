using System;
using System.Runtime.InteropServices;

namespace RestoreCursor {
    class Program {
        [DllImport("user32.dll", SetLastError = true)]
        [return: MarshalAs(UnmanagedType.Bool)]
        static extern bool SystemParametersInfo(uint uiAction, uint uiParam, IntPtr pvParam, uint fWinIni);

        const uint SPI_SETCURSORS = 0x0057;
        const uint SPIF_SENDCHANGE = 0x02;

        static void Main(string[] args) {
            SystemParametersInfo(SPI_SETCURSORS, 0, IntPtr.Zero, SPIF_SENDCHANGE);
        }
    }
}
