@echo off
chcp 65001 >nul
title Veritas UniClass
cd /d "%~dp0"
echo.
echo   ACADEMIA VERITAS UNICLASS
echo   -------------------------
where node >nul 2>nul
if errorlevel 1 (
  echo   [ERRO] Node.js nao encontrado.
  echo   Instale a versao LTS em https://nodejs.org e rode este arquivo de novo.
  pause
  exit /b 1
)
for /f "tokens=1 delims=." %%v in ('node -p "process.versions.node"') do set NODEMAJ=%%v
if %NODEMAJ% LSS 20 (
  echo   [ERRO] Seu Node.js e muito antigo. Instale a versao LTS em https://nodejs.org
  pause
  exit /b 1
)
if not exist node_modules (
  echo   Instalando dependencias, isso leva 1 a 2 minutos na primeira vez...
  call npm install --no-audit --no-fund
  if errorlevel 1 (
    echo   [ERRO] A instalacao falhou. Copie as mensagens acima e envie.
    pause
    exit /b 1
  )
)
echo   Abrindo http://localhost:3000/inicio ...
start "" cmd /c "timeout /t 8 >nul & start http://localhost:3000/inicio"
call npm run dev
pause
