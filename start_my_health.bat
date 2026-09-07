@echo off
echo ===================================================
echo Starting My Health - AI Interface and Backend
echo ===================================================

:: Start Python Backend in a new window
echo Starting FastAPI Backend (Port 8000)...
start "My Health Backend" cmd /c "cd backend && python -m venv venv && call venv\Scripts\activate.bat && pip install -r requirements.txt && python main.py"

:: Start Next.js Frontend in a new window
echo Starting Next.js Frontend (Port 3000)...
start "My Health Frontend" cmd /c "npm run dev"

echo.
echo Both servers are starting up.
echo - Frontend will be available at: http://localhost:3000
echo - Backend AI API will be available at: http://localhost:8000
echo.
pause
