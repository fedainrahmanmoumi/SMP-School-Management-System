@echo off
setlocal
cd /d "%~dp0"

echo ==============================================
echo     SMP INTERNATIONAL SCHOOL - WEBSITE
echo ==============================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed.
  echo Please install Node.js LTS, then run this file again.
  pause
  exit /b 1
)

if not exist node_modules\express (
  echo First-time setup: installing required packages...
  call npm install
  if errorlevel 1 (
    echo.
    echo Package installation failed. Please check your internet connection.
    pause
    exit /b 1
  )
)

echo Starting SMP server...
start "SMP Server" /min cmd /c "npm start"
timeout /t 3 /nobreak >nul
start "" "http://localhost:3000"
echo.
echo Website opened at http://localhost:3000
echo Keep the SMP Server window running while using the website.
echo.
pause
