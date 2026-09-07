@echo off
echo Starting all Hide-WIN services...

echo Starting API Server (FastAPI)...
start cmd /k "cd scripts && call start_api.bat"

echo Starting Cloud Relay (WebSockets)...
start cmd /k "cd scripts && call start_relay.bat"

echo Starting Web UI (React)...
start cmd /k "cd scripts && call start_ui.bat"

echo All background services started! You can now run the Desktop App!
pause
