Write-Host "Starting GitHub upload process..." -ForegroundColor Green

# Navigate to the script directory
Set-Location $PSScriptRoot

Write-Host "Initializing git repository..." -ForegroundColor Yellow
git init

Write-Host "Adding all files..." -ForegroundColor Yellow
git add .

Write-Host "Creating initial commit..." -ForegroundColor Yellow
git commit -m "Initial commit: FinestKnown precious metals e-commerce app with real-time pricing, modern auth, and live ticker"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "GitHub Repository Setup Required:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "1. Go to https://github.com" -ForegroundColor White
Write-Host "2. Click '+' then 'New repository'" -ForegroundColor White
Write-Host "3. Name: finestknown-app" -ForegroundColor White
Write-Host "4. Description: Precious metals e-commerce app with real-time pricing" -ForegroundColor White
Write-Host "5. Make it Public or Private" -ForegroundColor White
Write-Host "6. DON'T check 'Add a README file'" -ForegroundColor White
Write-Host "7. Click 'Create repository'" -ForegroundColor White
Write-Host ""
Write-Host "After creating the repository, run these commands:" -ForegroundColor Yellow
Write-Host "git remote add origin https://github.com/YOUR_USERNAME/finestknown-app.git" -ForegroundColor Green
Write-Host "git branch -M main" -ForegroundColor Green
Write-Host "git push -u origin main" -ForegroundColor Green
Write-Host ""
Write-Host "Replace YOUR_USERNAME with your actual GitHub username" -ForegroundColor Red
Write-Host "========================================" -ForegroundColor Cyan

Read-Host "Press Enter to continue"
