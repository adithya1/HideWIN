Add-Type -TypeDefinition "using System; using System.Runtime.InteropServices; public class KeyState { [DllImport("user32.dll")] public static extern short GetAsyncKeyState(int vKey); }"
while ($true) {
    $alt = [KeyState]::GetAsyncKeyState(0x12)
    $a = [KeyState]::GetAsyncKeyState(0x41)
    if (($alt -band 0x8000) -eq 0 -and ($a -band 0x8000) -eq 0) { break }
    Start-Sleep -Milliseconds 30
}
