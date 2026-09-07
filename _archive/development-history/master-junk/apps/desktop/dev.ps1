# HideWin Dev Launcher - kills zombie Electron and starts fresh
Write-Host "Stopping any running Electron processes..." -ForegroundColor Yellow
taskkill /F /IM electron.exe 2>&1 | Out-Null
Start-Sleep -Seconds 2

# Clean Singleton lock files
$lockPaths = @("$env:APPDATA\hide-win", "$env:LOCALAPPDATA\hide-win")
foreach ($p in $lockPaths) {
    if (Test-Path $p) {
        Get-ChildItem -Path $p -Include "Singleton*" -Recurse -ErrorAction SilentlyContinue | Remove-Item -Force -ErrorAction SilentlyContinue
    }
}

Write-Host "Starting HideWin..." -ForegroundColor Green
npm start
