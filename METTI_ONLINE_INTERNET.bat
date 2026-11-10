@echo off
title XviDeo AI 4K - Link Pubblico HTTPS per iPhone e Ospiti 1-a-1
cd /d "%~dp0"
echo ============================================================================
echo   Generazione Link Pubblico HTTPS in Rete (per iPhone 4G/5G e Amici)...
echo ============================================================================
start "Server Locale XviDeo 4K" /min python -u pc-bridge\bridge_server.py
timeout /t 2 >nul
echo.
echo   Tra pochi secondi qui sotto apparira' un link https://....lhr.life
echo   Copia quel link per aprirlo sul tuo iPhone o generare il link per l'amico!
echo ============================================================================
ssh -o StrictHostKeyChecking=no -R 80:localhost:8088 nokey@localhost.run
pause
