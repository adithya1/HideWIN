@echo off
echo Starting Hide-WIN Electron Desktop App...
cd ..\Hide-Win-Master
call npm start
if %errorlevel% neq 0 (
    echo [ERROR] npm start failed!
    pause
    exit /b %errorlevel%
)
pause
