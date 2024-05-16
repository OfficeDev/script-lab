# Readme

These scripts allow you to run a local CDN server to serve the static script-lab-build files from the pipeline output.

## Usage

### `start-server-script-lab-build.cmd`

This helps simulate a lab build on your local machine. It will start a local server and serve the static files from the build output.

1. Download the script-lab-build artifact from the build.
1. unzip the artifact on your desktop
1. As administrator run the script `local-server-setup.cmd`
1. run the start-server-script-lab-build.cmd script and pass in the location to the unzipped file.
   Example: `start-server-script-lab-build.cmd "%USERPROFILE%\Desktop\script-lab-build"`
1. Load script-lab in the browser and swap to localhost.
1. verify script lab is working as expected.

### `local-server-from-local-build.cmd`

Hosts the local build output from the local machine.

### `simulate-server.cmd`

This helps simulate 1cdn path hosting on the local machine from the local files build output.
