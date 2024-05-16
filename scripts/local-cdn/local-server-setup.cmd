@echo off
setlocal
:: Local Server Setup

set THISDIR=%~dp0
set THISDIR=%THISDIR:~,-1%


echo.
echo Install Certificates -Must be running as admin-
echo.

set command=npx office-addin-dev-certs install --machine
echo %command%
call %command%

echo.
echo Install http-server
echo.

set command=npm install -g http-server
echo %command%
call %command%




goto :eof

:usage
echo usage: [local server directory]
echo example: %USERPROFILE%\Desktop\local-server