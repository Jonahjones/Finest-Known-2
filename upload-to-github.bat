@echo off
echo ========================================
echo Uploading FinestKnown App to GitHub
echo Repository: https://github.com/Jonahjones/Finest-Known-2
echo ========================================

cd /d "%~dp0"

echo.
echo Step 1: Initializing git repository...
git init

echo.
echo Step 2: Adding all files to git...
git add .

echo.
echo Step 3: Creating initial commit...
git commit -m "Initial commit: FinestKnown precious metals e-commerce app with real-time pricing, modern auth, and live ticker"

echo.
echo Step 4: Adding remote repository...
git remote add origin https://github.com/Jonahjones/Finest-Known-2.git

echo.
echo Step 5: Setting main branch...
git branch -M main

echo.
echo Step 6: Pushing to GitHub...
git push -u origin main

echo.
echo ========================================
echo Upload Complete!
echo ========================================
echo Your app is now live at:
echo https://github.com/Jonahjones/Finest-Known-2
echo ========================================

pause