Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Uploading FinestKnown App to GitHub" -ForegroundColor Cyan
Write-Host "Repository: https://github.com/Jonahjones/Finest-Known-2" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Navigate to the script directory
Set-Location $PSScriptRoot

Write-Host ""
Write-Host "Step 1: Initializing git repository..." -ForegroundColor Yellow
git init

Write-Host ""
Write-Host "Step 2: Adding all files to git..." -ForegroundColor Yellow
git add .

Write-Host ""
Write-Host "Step 3: Creating initial commit..." -ForegroundColor Yellow
git commit -m "Initial commit: FinestKnown precious metals e-commerce app with real-time pricing, modern auth, and live ticker"

Write-Host ""
Write-Host "Step 4: Adding remote repository..." -ForegroundColor Yellow
git remote add origin https://github.com/Jonahjones/Finest-Known-2.git

Write-Host ""
Write-Host "Step 5: Setting main branch..." -ForegroundColor Yellow
git branch -M main

Write-Host ""
Write-Host "Step 6: Pushing to GitHub..." -ForegroundColor Yellow
git push -u origin main

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Upload Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "Your app is now live at:" -ForegroundColor White
Write-Host "https://github.com/Jonahjones/Finest-Known-2" -ForegroundColor Blue
Write-Host "========================================" -ForegroundColor Green

Read-Host "Press Enter to continue"