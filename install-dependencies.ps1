Write-Host "Installing FinestKnown dependencies..." -ForegroundColor Green

Set-Location $PSScriptRoot

Write-Host ""
Write-Host "Installing zustand..." -ForegroundColor Yellow
npm install zustand@^5.0.2

Write-Host ""
Write-Host "Installing all dependencies..." -ForegroundColor Yellow
npm install

Write-Host ""
Write-Host "Verifying installation..." -ForegroundColor Yellow
npm list zustand

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Installation Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "You can now run: npm start" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Green

Read-Host "Press Enter to continue"

