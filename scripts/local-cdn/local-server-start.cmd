@echo off
setlocal enabledelayedexpansion
:: Local Server Start

set THISDIR=%~dp0
set THISDIR=%THISDIR:~,-1%

set server_location=%1
set port=%2

if not defined server_location (
    goto :usage
)

if not defined port (
    set port=3000
)

if not exist "%server_location%" (
    
    echo.
    echo Creating Server
    echo.

    set command=%THISDIR%\local-server-setup.cmd "%server_location%"
    echo !command!
    call !command!
)

echo.
echo Start Local Server: %server_location%
echo.

set command=start "Local Server: %server_location%" /D "%server_location%" http-server %server_location% --ssl --cert %USERPROFILE%\\.office-addin-dev-certs\\localhost.crt --key %USERPROFILE%\\.office-addin-dev-certs\\localhost.key -c-1 --cors -p %port%
echo %command%
call %command%

echo.
echo Test Local Server by going to the following location in a browser:
echo.
echo https://localhost:%port%/index.html
echo.


goto :eof

:usage
echo usage: [local server directory]
echo example: %%USERPROFILE%%\Desktop\local-server