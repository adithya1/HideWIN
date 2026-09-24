@echo off
echo Stopping Cloud Relay...
FOR /F "tokens=5" %%a IN ('netstat -aon ^| findstr :9000 ^| findstr LISTENING') DO taskkill /F /PID %%a
echo Cloud Relay stopped.
