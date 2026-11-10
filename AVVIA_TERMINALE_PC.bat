@echo off
title CADBridge Pro - Terminale PC (AutoCAD 2013+ ^& SketchUp 2021+)
cd /d "%~dp0"
echo ======================================================================
echo   Avvio CADBridge Pro su PC e Rete Locale...
echo ======================================================================
start "" "http://localhost:8088"
python pc-bridge\bridge_server.py
pause
