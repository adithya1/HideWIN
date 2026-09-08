@echo off
echo Starting Hide-WIN Backend API...
cd ..
set PYTHONPATH=%cd%
uvicorn services.api.main:app --host 0.0.0.0 --port 8000 --reload
