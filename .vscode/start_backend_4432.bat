@echo off
echo Starting NASA SBIR Ignite Backend on port 4432...
uvicorn backend.main:app --host 0.0.0.0 --port 4432 --reload
pause
