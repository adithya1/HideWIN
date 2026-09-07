using System;
using System.Drawing;
using System.Windows.Forms;
public class TestBlocker : Form {
    public TestBlocker() {
        this.FormBorderStyle = FormBorderStyle.None;
        this.StartPosition = FormStartPosition.Manual;
        this.Location = new Point(500, 500);
        this.Size = new Size(1, 1); 
        this.TopMost = true;
        this.ShowInTaskbar = false;
        // No Opacity setting, so it's a solid 1x1 window
    }
    protected override CreateParams CreateParams {
        get {
            CreateParams cp = base.CreateParams;
            cp.ExStyle |= 0x08000000; // WS_EX_NOACTIVATE
            return cp;
        }
    }
    protected override void OnMouseWheel(MouseEventArgs e) {
        Console.WriteLine("SWALLOWED WHEEL: " + e.Delta);
        base.OnMouseWheel(e);
    }
    public static void Main() {
        TestBlocker f = new TestBlocker();
        f.Show();
        System.Threading.Thread.Sleep(3000);
    }
}
