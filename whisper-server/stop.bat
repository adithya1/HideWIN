@echo off
echo Stopping Whisper Standalone Server...
FOR /F "tokens=5" %%T IN ('netstat -a -n -o ^| findstr "0.0.0.0:8001" ') DO (
    echo Killing process %%T
    taskkill /F /PID %%T
)
echo Server stopped.
