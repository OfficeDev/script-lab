@echo off
setlocal enabledelayedexpansion
:: Local Server Start

set THISDIR=%~dp0
set THISDIR=%THISDIR:~,-1%

set script_lab=%THISDIR%\..
set script_lab_build=%THISDIR%\..\packages

set script_lab_build_editor=%script_lab_build%\editor\build
set script_lab_build_runner=%script_lab_build%\runner\build


set target_location=\\WBP-AUTOBOX-002\Script-Lab\script-lab

set target_location_edit=%target_location%\edit
set target_location_run=%target_location%\run

:: Start Copying

echo copy manifests
set command=xcopy /S /I /Q /Y %script_lab%\manifests\* %target_location%\manifests\*
echo %command%
call %command%

echo.

echo copy edit
xcopy /S /I /Q /Y %script_lab_build_editor% %target_location_edit%

echo.

echo copy run
xcopy /S /I /Q /Y %script_lab_build_runner% %target_location_run%

echo.

