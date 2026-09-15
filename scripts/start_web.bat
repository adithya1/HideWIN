@echo off
echo Starting Hide-WIN React Web App...
cd ..\services\web
call npm run dev
if %errorlevel% neq 0 (
    echo [ERROR] npm run dev failed!
    pause
    exit /b %errorlevel%
)
pause
