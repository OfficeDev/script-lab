
@echo off
setlocal enabledelayedexpansion
:: Local Server Start

set THISDIR=%~dp0
set THISDIR=%THISDIR:~,-1%

set script_lab_build=%THISDIR%\..\..\packages
if not defined script_lab_build (
    goto :usage
)


::
:: Editor
::

set server_location=%script_lab_build%\editor\build
set port=3000

set command=%THISDIR%\local-server-start.cmd "%server_location%" %port%
echo !command!
call !command!


::
:: runner
::

set server_location=%script_lab_build%\runner\build
set port=3200

set command=%THISDIR%\local-server-start.cmd "%server_location%" %port%
echo !command!
call !command!


goto :eof

:usage
echo usage: [local script-lab-build directory]
echo example: %USERPROFILE%\Desktop\script-lab-build