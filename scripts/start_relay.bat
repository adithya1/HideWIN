@echo off
echo Starting Hide-WIN Cloud Relay...
cd ..\hidewin-cloud-relay
uvicorn cloud_relay:app --host 0.0.0.0 --port 9000
