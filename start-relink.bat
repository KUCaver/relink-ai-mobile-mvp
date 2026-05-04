@echo off
title Re:Link AI - local server
cd /d "%~dp0"

echo.
echo  [1/3] Stopping existing server on port 7754...
for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| findstr ":7754 "') do taskkill /f /pid %%a >nul 2>&1

echo  [2/3] Starting local server on port 7754...
where npm.cmd >nul 2>&1
if errorlevel 1 (
  start /min "Re:Link Server" powershell -NoProfile -ExecutionPolicy Bypass -Command "$env:RELINK_FRONTEND_PORT='7754'; python -m http.server 7754"
) else (
  start /min "Re:Link Server" npm.cmd run dev
)

timeout /t 2 /nobreak >nul

echo  [3/3] Opening browser...
start "" "http://localhost:7754/Re-Link AI Mobile MVP.html"

echo.
echo =========================================
echo   Re:Link AI MVP is running.
echo   URL: http://localhost:7754
echo =========================================
echo.
echo   Keep this window open while using the app.
echo   Press any key to stop the server.
echo.
pause >nul

echo.
echo  Stopping server...
for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| findstr ":7754 "') do taskkill /f /pid %%a >nul 2>&1
echo  Done.
