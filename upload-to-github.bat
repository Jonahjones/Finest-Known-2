@echo off
echo Starting GitHub upload process...

cd /d "%~dp0"

echo Initializing git repository...
git init

echo Adding all files...
git add .

echo Creating initial commit...
git commit -m "Initial commit: FinestKnown precious metals e-commerce app with real-time pricing, modern auth, and live ticker"

echo.
echo ========================================
echo GitHub Repository Setup Required:
echo ========================================
echo 1. Go to https://github.com
echo 2. Click "+" then "New repository"
echo 3. Name: finestknown-app
echo 4. Description: Precious metals e-commerce app with real-time pricing
echo 5. Make it Public or Private
echo 6. DON'T check "Add a README file"
echo 7. Click "Create repository"
echo.
echo After creating the repository, run this command:
echo git remote add origin https://github.com/YOUR_USERNAME/finestknown-app.git
echo git branch -M main
echo git push -u origin main
echo.
echo Replace YOUR_USERNAME with your actual GitHub username
echo ========================================

pause
