# Contributing

There are several ways in which you can contribute to the project:

1. **Log bugs or file feature suggestions**. To do this, simply file the bugs/suggestions in the Issues tab on GitHub for this project.
2. **Code samples**. To suggest edits to existing samples, or to suggest your own, please submit a pull request against the Samples repo: **<https://github.com/OfficeDev/office-js-snippets>**.
3. **Bug-fix/feature contributions**. If you have features or bug fixes that you'd like to see incorporated into Script Lab, just send us your pull request!

# Running Script Lab React from source

## Prereq:

- Download & Install Visual Studio Code. <https://code.visualstudio.com/>.
- Install the recommended VS extensions (which you should be prompted for when you open the repo).
- Download & install Node (version v10+). <https://nodejs.org/en>.
- Download & install Yarn, for use as an alternative for `npm install`. Download from <https://yarnpkg.com/en/docs/install> (or bootstrap Yarn installation by running once `npm install -g yarn`). The documentation also describes why Yarn is preferable to `npm install`.

Note: the installation of Node JS and Yarn add paths to your operating system's PATH variable. Therefore, in some cases you may log off and log in from your System to get Node JS and Yarn work withing Visual Studio Code.

## Build steps:

From the root of the repo:

1. `yarn install`
2. `yarn start`

## Testing inside of an add-in

1. Locate the add-in manifest (which you'll find in the `manifests` folder in the root of the repo). For purposes of running against localhost, use `localhost.xml`.

2. Sideload the manifest into your office host application. See <https://aka.ms/sideload-addins>, which includes instructions and a step-by-step video for sideloading on the desktop, as well as links for the other platforms.

## [Optional] Testing GitHub auth locally (on localhost)

1. Go to <https://github.com/settings/developers>, and click "[Register new application](https://github.com/settings/applications/new)" if you haven't done it before for your own dev copy of ScriptLab.
2. Give it a name like "ScriptLab Local Dev", with a Homepage and Auth callback URL of `https://localhost:3000`.
3. Plumb this client ID and secret through (instructions TBD -- TODO).

# Manual-testing scenarios

Please see "[TESTING.md](TESTING.md)".
