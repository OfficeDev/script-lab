
@echo off
setlocal enabledelayedexpansion
:: Local Server Start

:: end any existing node processes
call taskkill /f /im node.exe

:: rebuild
call npm run clean
call npm run build

:: copy over files

set THISDIR=%~dp0
set THISDIR=%THISDIR:~,-1%

:: source
set packages=%THISDIR%\..\..\packages

set editor_build=%packages%\editor\build
set runner_build=%packages%\runner\build


:: destination
set script_lab_build=%USERPROFILE%\Desktop\script-lab-build
:: clear out old files
if exist "%script_lab_build%" (
    rmdir /S /Q "%script_lab_build%"
    mkdir "%script_lab_build%"
)

set script_lab_build_editor=%script_lab_build%\editor
set script_lab_build_runner=%script_lab_build%\runner

xcopy /E /I /Y "%editor_build%" "%script_lab_build_editor%/script-lab/7dttl"
xcopy /E /I /Y "%runner_build%" "%script_lab_build_runner%/script-lab-runner/7dttl"

:: boot server

::
:: Editor
::

set server_location=%script_lab_build_editor%
set port=3000

set command=%THISDIR%\local-server-start.cmd "%server_location%" %port%
echo !command!
call !command!

set url=https://localhost:3000/script-lab/7dttl/index.html
echo %url%
start %url%

::
:: runner
::

set server_location=%script_lab_build_runner%
set port=3200

set command=%THISDIR%\local-server-start.cmd "%server_location%" %port%
echo !command!
call !command!

set url=https://localhost:3200/script-lab-runner/7dttl/index.html
echo %url%
start %url%