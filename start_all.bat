@echo off
echo Starting all Hide-WIN services...

echo Starting API Server (FastAPI)...
start cmd /k "cd scripts && call start_api.bat"

echo Starting Web App (React)...
start cmd /k "cd scripts && call start_web.bat"

echo Starting Desktop App (Electron)...
start cmd /k "cd scripts && call start_ui.bat"

echo All background services started!
pause
