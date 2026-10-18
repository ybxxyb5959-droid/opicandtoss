@echo off
cd /d "%~dp0"

where node >nul 2>nul
if %errorlevel%==0 (
  node "%~dp0server.js"
) else (
  start msedge --app="%~dp0index.html"
)
