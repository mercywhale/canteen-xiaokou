@echo off
title 小口订餐系统 - 外网版
echo ====================================
echo   小口订餐系统 - 正在启动...
echo ====================================
echo.

echo [1/3] 正在启动订餐服务...
start /b python "%~dp0dingcan.py" > nul 2>&1
timeout /t 3 /nobreak > nul

echo [2/3] 正在启动外网隧道...
echo      (首次启动需要约10秒，请耐心等待)
echo.
echo ====================================
echo   外网链接获取中...
echo   请等待下方显示 trycloudflare.com 链接
echo   把那个链接发给同事就能用了！
echo ====================================
echo.

"%~dp0cloudflared.exe" tunnel --url http://localhost:8001 --no-autoupdate

pause
