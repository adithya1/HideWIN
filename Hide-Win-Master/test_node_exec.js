const { exec } = require('child_process');
const psCommand = `$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('C:\\Users\\akula\\OneDrive\\Desktop\\HideWin_Test_Node.lnk'); $Shortcut.TargetPath = 'C:\\Windows\\System32\\notepad.exe'; $Shortcut.Save()`;
exec(`powershell -NoProfile -NonInteractive -WindowStyle Hidden -Command "${psCommand}"`, (error, stdout, stderr) => {
    if (error) {
        console.error("ERROR:", error.message);
        console.error("STDERR:", stderr);
    } else {
        console.log("SUCCESS");
    }
});
