@echo off
REM Deployment Preparation Script for Windows
REM This script prepares the project for production deployment

setlocal enabledelayedexpansion

echo.
echo ================================
echo E-Commerce Website Deployment
echo Preparation Script
echo ================================
echo.

REM Check Node.js
echo Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js not found. Please install Node.js v16 or higher.
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo [OK] Node.js %NODE_VERSION% found
echo.

REM Check npm
echo Checking npm installation...
npm --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: npm not found. Please install npm.
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo [OK] npm %NPM_VERSION% found
echo.

REM Install root dependencies
echo Installing root dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install root dependencies
    pause
    exit /b 1
)
echo [OK] Root dependencies installed
echo.

REM Install client dependencies
echo Installing client dependencies...
cd client
call npm install
cd ..
if errorlevel 1 (
    echo ERROR: Failed to install client dependencies
    pause
    exit /b 1
)
echo [OK] Client dependencies installed
echo.

REM Build client
echo Building client for production...
cd client
call npm run build
cd ..
if errorlevel 1 (
    echo ERROR: Failed to build client
    pause
    exit /b 1
)
echo [OK] Client built successfully
echo.

REM Environment check
echo Checking environment files...
if exist ".env.production" (
    echo [OK] .env.production found
) else (
    echo [WARNING] .env.production not found. Please create it before deployment.
)

if exist "client\.env.production" (
    echo [OK] client\.env.production found
) else (
    echo [WARNING] client\.env.production not found. Please create it before deployment.
)
echo.

REM Check build output
if exist "client\dist" (
    echo [OK] Production build output found in client\dist
) else (
    echo ERROR: Production build not found.
    pause
    exit /b 1
)

echo.
echo ================================
echo Preparation Complete! [OK]
echo ================================
echo.

echo Next steps:
echo 1. Update .env.production with your production values:
echo    - Set CLIENT_URL to your domain
echo    - Verify all credentials are correct
echo.
echo 2. Test locally:
echo    npm start
echo.
echo 3. Deploy to your hosting platform
echo.
echo For detailed deployment instructions, see DEPLOYMENT.md
echo.

pause
