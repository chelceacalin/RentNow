@echo off
setlocal enabledelayedexpansion

echo ============================================
echo Cleaning up old Docker images...
echo ============================================

:: Remove old images for core, api_gateway, api_server, reports_service, and notification_service
docker rmi core api_gateway api_server reports_service notification_service 2>nul
echo ============================================
echo Building the API_GATEWAY Docker image...
echo ============================================

:: Navigate to the api_gateway directory and build the image
cd api_gateway
docker build -t api_gateway .
IF %ERRORLEVEL% NEQ 0 (
    echo Failed to build the API_GATEWAY Docker image.
    pause
    exit /b %ERRORLEVEL%
)

echo ============================================
echo Building the API_SERVER Docker image...
echo ============================================

:: Navigate to the api_server directory and build the image
cd ..\api_server
docker build -t api_server .
IF %ERRORLEVEL% NEQ 0 (
    echo Failed to build the API_SERVER Docker image.
    pause
    exit /b %ERRORLEVEL%
)

echo ============================================
echo Building the REPORTS_SERVICE Docker image...
echo ============================================

:: Navigate to the reports_service directory and build the image
cd ..\reports_service
docker build -t reports_service .
IF %ERRORLEVEL% NEQ 0 (
    echo Failed to build the REPORTS_SERVICE Docker image.
    pause
    exit /b %ERRORLEVEL%
)

echo ============================================
echo Building the NOTIFICATION_SERVICE Docker image...
echo ============================================

:: Navigate to the notification_service directory and build the image
cd ..\notification_service
docker build -t notification_service .
IF %ERRORLEVEL% NEQ 0 (
    echo Failed to build the NOTIFICATION_SERVICE Docker image.
    pause
    exit /b %ERRORLEVEL%
)

echo ============================================
echo All Docker images have been built successfully!
echo ============================================
