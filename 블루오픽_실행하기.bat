@echo off
cd /d "%~dp0"
title Blue OPIc

where node >nul 2>nul
if errorlevel 1 goto nonode

rem AI server (local Worker): start it when worker\.dev.vars has a real key
set AI=0
if exist "%~dp0worker\.dev.vars" (
  findstr /B /C:"GEMINI_API_KEY=" "%~dp0worker\.dev.vars" | findstr /V /C:"=$" | findstr /V /C:"KEY=여기에" >nul 2>nul && set AI=1
)

if "%AI%"=="1" (
  echo [AI] Gemini 키를 찾았어요. AI 서버를 새 창으로 켭니다 - 그 창을 닫으면 AI 첨삭이 꺼져요.
  start "Blue OPIc AI server" cmd /k "cd /d %~dp0worker && npx wrangler dev --port 8787"
) else (
  echo [AI] worker\.dev.vars 에 Gemini 키가 없어서 AI 첨삭 없이 실행해요.
)

echo [APP] 앱 서버를 켭니다. 이 창을 닫으면 앱이 꺼져요.
set PORT=4180
node "%~dp0server.js"
echo.
echo 앱 서버가 종료됐어요. 아무 키나 누르면 창이 닫혀요.
pause >nul
goto end

:nonode
echo Node.js 가 없어요. https://nodejs.org 에서 LTS 설치 후 다시 실행해 주세요.
pause

:end
