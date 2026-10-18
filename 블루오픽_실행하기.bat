@echo off
chcp 65001 >nul
cd /d "%~dp0"

where node >nul 2>nul
if not %errorlevel%==0 (
  echo Node.js가 없어요. https://nodejs.org 에서 LTS를 설치한 뒤 다시 실행해 주세요.
  pause
  exit /b
)

rem AI 서버(로컬 Worker): worker\.dev.vars 에 키가 있으면 같이 켠다
findstr /B /C:"GEMINI_API_KEY=" "%~dp0worker\.dev.vars" 2>nul | findstr /V /C:"여기에_키" | findstr /V /R /C:"GEMINI_API_KEY=$" >nul
if %errorlevel%==0 (
  start "블루오픽 AI 서버 (닫으면 AI 첨삭이 꺼져요)" cmd /k "cd /d "%~dp0worker" && npx wrangler dev --port 8787"
) else (
  echo [안내] worker\.dev.vars 에 Gemini 키가 없어서 AI 첨삭 없이 실행해요. (내장 코치만 동작)
)

set PORT=4180
node "%~dp0server.js"
