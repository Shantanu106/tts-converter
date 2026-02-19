@echo off
REM TTS Converter - Quick Start Script for Windows
REM This script sets up and runs the backend in development mode

echo.
echo 🚀 TTS Converter - Quick Start (Windows)
echo ======================================

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed or not in PATH
    pause
    exit /b 1
)
echo ✓ Python found

REM Check if Node.js is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js/npm is not installed or not in PATH
    pause
    exit /b 1
)
echo ✓ Node.js found

REM Setup Backend
echo.
echo Setting up backend...
cd backend

REM Create virtual environment if it doesn't exist
if not exist "venv" (
    echo Creating Python virtual environment...
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Install dependencies
echo Installing Python dependencies...
pip install -q -r requirements.txt

REM Create necessary directories
if not exist "models" mkdir models
if not exist "audio_cache" mkdir audio_cache
if not exist "temp_audio" mkdir temp_audio

echo ✓ Backend ready

REM Setup Frontend
echo.
echo Setting up frontend...
cd ..\frontend

REM Install dependencies
if not exist "node_modules" (
    echo Installing npm dependencies...
    npm install -q
)

echo ✓ Frontend ready
cd ..

REM Print instructions
echo.
echo ======================================
echo ✅ Setup complete!
echo ======================================
echo.
echo To start the application:
echo.
echo Terminal 1 ^(Backend^):
echo   cd backend
echo   venv\Scripts\activate.bat
echo   python main.py
echo.
echo Terminal 2 ^(Frontend^):
echo   cd frontend
echo   npm run dev
echo.
echo Then open: http://localhost:5173
echo.
echo API Docs: http://localhost:8000/docs
echo.
pause
