@echo off
cd /d "%~dp0"
echo Encerrando servidor porta 3456...

for /f "tokens=5" %%a in ('netstat -ano ^| find ":3456" ^| find "LISTENING"') do (
  taskkill /F /PID %%a >nul 2>&1
)

echo Pronto.
timeout /t 2 >nul
