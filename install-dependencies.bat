@echo off
echo Installing FinestKnown dependencies...

cd /d "%~dp0"

echo.
echo Installing zustand...
npm install zustand@^5.0.2

echo.
echo Installing all dependencies...
npm install

echo.
echo Verifying installation...
npm list zustand

echo.
echo ========================================
echo Installation Complete!
echo ========================================
echo You can now run: npm start
echo ========================================

pause

