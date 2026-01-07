@echo off
cd /d %~dp0
echo Parando processos anteriores...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo.
echo Iniciando Backend na porta 5000...
start "BACKEND - Oficio Cortes" cmd /k "node backend/server-firebase.js"
timeout /t 3 /nobreak >nul

echo.
echo Iniciando Frontend na porta 3000...
start "FRONTEND - Oficio Cortes" cmd /k "npm run dev"

echo.
echo ============================================
echo Servidores iniciados!
echo ============================================
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Aguarde 10 segundos e acesse: http://localhost:3000
echo.
pause
