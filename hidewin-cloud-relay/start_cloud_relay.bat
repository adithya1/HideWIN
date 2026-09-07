@echo off
echo Starting Hide-WIN Cloud Relay Simulation on Port 9000...
start /B uvicorn cloud_relay:app --port 9000 --host 0.0.0.0
echo Cloud Relay is running.
