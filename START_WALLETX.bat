@echo off
echo.
echo ========================================
echo   WALLETX - STARTING APPLICATION
echo ========================================
echo.

REM Check if MongoDB is installed
where mongod >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] MongoDB not found in PATH
    echo Please ensure MongoDB is installed and running
    echo.
)

REM Start Backend
echo [1/3] Starting Backend Server...
start "WalletX Backend" cmd /k "cd /d "%~dp0server" && npm run dev"
timeout /t 3 >nul

REM Start Frontend
echo [2/3] Starting Frontend...
start "WalletX Frontend" cmd /k "cd /d "%~dp0client" && npm start"
timeout /t 2 >nul

echo [3/3] Opening Browser...
timeout /t 5 >nul
start http://localhost:3000

echo.
echo ========================================
echo   WALLETX IS NOW RUNNING!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Demo Login: john@walletx.demo / User@12345
echo.
echo Press any key to close this window...
pause >nul
