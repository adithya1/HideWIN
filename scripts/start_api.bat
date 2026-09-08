@echo off
echo Starting Hide-WIN Backend API...
cd ..\services\api
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
