@echo off
echo Starting Hide-WIN Electron Desktop App...
cd ..\Hide-Win-Master
call npm run dev
if %errorlevel% neq 0 (
    echo [ERROR] npm run dev failed!
    pause
    exit /b %errorlevel%
)
pause
