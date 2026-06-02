@echo off
cd /d "%~dp0"
title LA Custom - Demo Estoque

set "PATH=%ProgramFiles%\nodejs;%ProgramFiles(x86)%\nodejs;%APPDATA%\npm;%LOCALAPPDATA%\Programs\nodejs;%PATH%"

where node >nul 2>&1
if errorlevel 1 (
  echo.
  echo  ERRO: Node.js nao encontrado.
  echo  Instale em https://nodejs.org e tente de novo.
  echo  Ou rode a demo no PC onde voce desenvolve com o Cursor.
  echo.
  pause
  exit /b 1
)

if not exist "dist\index.html" (
  echo Gerando demonstracao...
  call npm run build:demo
  if errorlevel 1 (
    echo ERRO ao gerar. Nesta pasta rode: npm install
    pause
    exit /b 1
  )
)

echo Abrindo http://localhost:3456
start "" "http://localhost:3456"
start /min cmd /c "npx --yes serve@14.2.4 dist -l 3456"

echo.
echo Servidor ativo. Para encerrar: Encerrar-Estoque.bat
echo.
pause
