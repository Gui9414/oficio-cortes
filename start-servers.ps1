# Script para iniciar ambos os servidores
Write-Host "Parando processos Node existentes..." -ForegroundColor Yellow
Stop-Process -Name node -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

Write-Host "`nIniciando Backend (Firebase)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; Write-Host 'BACKEND RODANDO' -ForegroundColor Green; npm run server:firebase"

Write-Host "`nAguardando backend inicializar..." -ForegroundColor Yellow
Start-Sleep -Seconds 4

Write-Host "`nIniciando Frontend (Vite)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; Write-Host 'FRONTEND RODANDO' -ForegroundColor Green; npm run dev"

Start-Sleep -Seconds 3

Write-Host "`n============================================" -ForegroundColor Green
Write-Host "Servidores iniciados!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend: http://localhost:5000" -ForegroundColor Cyan
Write-Host "`nVerificando conexões..." -ForegroundColor Yellow

Start-Sleep -Seconds 2

try {
    $backend = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -UseBasicParsing -TimeoutSec 3
    Write-Host "✅ Backend: OK" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend: ERRO" -ForegroundColor Red
}

try {
    $frontend = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 3
    Write-Host "✅ Frontend: OK" -ForegroundColor Green
} catch {
    Write-Host "❌ Frontend: ERRO (aguarde mais alguns segundos)" -ForegroundColor Yellow
}

Write-Host "`nPressione Enter para fechar esta janela..."
Read-Host
