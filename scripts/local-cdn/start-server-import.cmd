
@echo off
setlocal enabledelayedexpansion

::
:: This script tests out the import iframe for script lab
::


:: Local Server Start

set THISDIR=%~dp0
set THISDIR=%THISDIR:~,-1%

set script_lab_import=%THISDIR%\..\..\import

::
:: iframe import.html
::

set server_location=%script_lab_import%
set port=3000

set command=%THISDIR%\local-server-start.cmd "%server_location%" %port%
echo !command!
call !command!


::
:: test-import.html
::

set server_location=%script_lab_import%
set port=4000

set command=%THISDIR%\local-server-start.cmd "%server_location%" %port%
echo !command!
call !command!

set url=https://localhost:4000/test-import.html
start %url%