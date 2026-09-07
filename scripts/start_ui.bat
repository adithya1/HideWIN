@echo off
echo Starting React Web UI...
cd ..\Hide-Win-Web
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] npm install failed!
    pause
    exit /b %errorlevel%
)
call npm run dev
if %errorlevel% neq 0 (
    echo [ERROR] npm run dev failed!
    pause
    exit /b %errorlevel%
)
pause
