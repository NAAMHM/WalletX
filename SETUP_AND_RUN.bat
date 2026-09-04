@echo off
echo.
echo ========================================
echo   WALLETX - COMPLETE SETUP
echo ========================================
echo.

echo [STEP 1/5] Installing Backend Dependencies...
cd /d "%~dp0server"
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Backend installation failed
    pause
    exit /b 1
)
echo [SUCCESS] Backend dependencies installed
echo.

echo [STEP 2/5] Installing Frontend Dependencies...
cd /d "%~dp0client"
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Frontend installation failed
    pause
    exit /b 1
)
echo [SUCCESS] Frontend dependencies installed
echo.

echo [STEP 3/5] Checking MongoDB...
where mongod >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] MongoDB not found in PATH
    echo.
    echo Please install MongoDB from: https://www.mongodb.com/try/download/community
    echo Or ensure MongoDB service is running
    echo.
    choice /C YN /M "Continue without seeding database (Y/N)?"
    if errorlevel 2 exit /b 1
) else (
    echo [SUCCESS] MongoDB found
    echo.
    echo [STEP 4/5] Seeding Database with Demo Data...
    cd /d "%~dp0server"
    call npm run seed
    if %ERRORLEVEL% NEQ 0 (
        echo [WARNING] Database seeding failed (MongoDB may not be running)
        echo You can run 'npm run seed' manually later
    ) else (
        echo [SUCCESS] Database seeded with demo data
    )
)
echo.

echo [STEP 5/5] Setup Complete!
echo.
echo ========================================
echo   READY TO START WALLETX!
echo ========================================
echo.
echo To start the application, run: START_WALLETX.bat
echo Or manually:
echo   - Backend: cd server && npm run dev
echo   - Frontend: cd client && npm start
echo.
echo Demo Login Credentials:
echo   Email:    john@walletx.demo
echo   Password: User@12345
echo.
echo Press any key to exit...
pause >nul
