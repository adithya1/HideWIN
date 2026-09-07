@echo off
echo Starting Hide-WIN Backend API...
cd ..\hidewin-fastapi
uvicorn run_api:app --host 0.0.0.0 --port 8000 --reload
