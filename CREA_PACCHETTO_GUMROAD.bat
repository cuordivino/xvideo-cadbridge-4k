@echo off
title Creazione Pacchetto Commerciale Gumroad - CADBridge Pro
cd /d "%~dp0"
echo ======================================================================
echo   Creazione pacchetto CADBridge_Pro_Gumroad_Release.zip in corso...
echo ======================================================================
powershell -NoProfile -Command "Compress-Archive -Path 'index.html','styles.css','app.js','manifest.json','sw.js','AVVIA_TERMINALE_PC.bat','README_GITHUB_GUMROAD.md','pc-bridge','plugins' -DestinationPath 'CADBridge_Pro_Gumroad_Release.zip' -Force"
echo.
echo [OK] File CADBridge_Pro_Gumroad_Release.zip creato con successo!
echo Puoi caricarlo direttamente nella pagina prodotto di Gumroad.
pause
