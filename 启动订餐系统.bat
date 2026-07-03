@echo off
title 小口订餐系统
echo ====================================
echo   小口订餐系统 - 正在启动...
echo ====================================
echo.
echo 正在检查Python环境...

python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未找到Python，请先安装Python
    echo 下载地址: https://www.python.org/downloads/
    echo 安装时记得勾选 "Add Python to PATH"
    pause
    exit
)

echo Python环境正常
echo.
echo 正在安装依赖...
pip install flask flask-cors -q

echo.
echo 正在启动订餐系统...
echo.
python "%~dp0dingcan.py"
pause
