@echo off
title Re:Link AI ^— 로컬 서버 실행 중
cd /d "C:\Users\gando\OneDrive\바탕 화면\건국대학교\건국대학교3학년 1학기\공모전\AI경진대회\프론 트이미지\App onboarding"

echo.
echo  [1/3] 기존 서버 정리 중...
for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| findstr ":7654 "') do taskkill /f /pid %%a >nul 2>&1

echo  [2/3] 서버 시작 중 (port 7654)...
start /min "Re:Link Server" python -m http.server 7654

timeout /t 2 /nobreak >nul

echo  [3/3] 브라우저 열기...
start "" "http://localhost:7654/Re-Link AI Mobile MVP.html"

echo.
echo =========================================
echo   Re:Link AI MVP 가 실행됐어요!
echo   주소: http://localhost:7654
echo =========================================
echo.
echo   이 창을 닫으면 서버도 함께 종료됩니다.
echo   아무 키나 누르면 종료합니다.
echo.
pause >nul

echo.
echo  서버 종료 중...
for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| findstr ":7654 "') do taskkill /f /pid %%a >nul 2>&1
echo  완료.
