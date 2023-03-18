@echo off
REM Kill the hanging vrserver.exe process or processes if they exist
taskkill /f /im vrserver.exe /t

REM Wait 5 seconds to make sure wireless HMD is discovered and connected
timeout 7 >nul

REM Start SteamVR 
start "Start SteamVR" "C:\Program Files (x86)\Steam\steamapps\common\SteamVR\bin\win64\vrstartup.exe"