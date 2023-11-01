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

Note: the installation of Node JS add paths to your operating system's PATH variable. Therefore, in some cases you may log off and log in from your System to get Node JS and npm run to work within Visual Studio Code.

## Build steps:

From the root of the repo:

1. `npm install` **Be sure to run this after every pull/merge!**
2. `npm run start`

An SSL certificate for localhost along with the CA certificate and key will be written to ~/.office-addin-dev-certs (%USERPROFILE%\.office-addin-dev-certs on Windows).
Please accept the prompt or dialog that appears if the CA certificate needs to be installed.

Your default browser will launch almost immediately. However, note that **it will take some 30-60 seconds before the website is actually up and running.**

Also, on first launch, the browsers will be stuck on the "Loading" page -- you will need to press ctrl+R to reload and show the actual editor/runner.

Also note that you'll see a few warnings in the node console. You can safely ignore them.

```
Compiled with warnings.

.../script-lab-react/node_modules/prettier/standalone.js
Critical dependency: the request of a dependency is an expression

.../script-lab-react/node_modules/typescript/lib/typescript.js
Critical dependency: the request of a dependency is an expression

.../script-lab-react/node_modules/source-map-support/source-map-support.js
Module not found: Can't resolve 'module' in '...\script-lab-react\node_modules\source-map-support'
```

When running locally, the Runner console might also show the following errors:

```
.../script-lab-react/node_modules/typescript/lib/typescript.js
Critical dependency: the request of a dependency is an expression

.../script-lab-react/node_modules/source-map-support/source-map-support.js
Module not found: Can't resolve 'module' in ...\script-lab-react\script-lab-react\node_modules\source-map-support'

Warning: Cannot update during an existing state transition (such as within `render`). Render methods should be a pure function of props and state.
```

You can safely ignore these -- those won't show up to users on the production site.

## Testing inside of an add-in

The **easiest** option is to install the **Store** version of the add-in (get it from <https://aka.ms/getscriptlab>). Then, using the dropdown on bottom left when in the Settings mode, switch to alpha -- and **from alpha, to localhost**. Note that the localhost option will only show up if you're in alpha (or already on localhost). The steps are akin to what's [described in the README](README.md#2017) for switching to Script Lab 2017, except choosing "Alpha" and then "localhost:3000" instead.

Note that just like described in the section above, you will need to bypass the HTTPS security warning for localhost.

**Alternatively**, you can also sideload the localhost manifest directly (though for that option, you might be forced to trust and re-trust the certificates!). The manifest is located at 'manifests/script-lab-react-localhost.xml', and instructions for sideloading can be found at <https://aka.ms/sideload-addins>.

## [Optional] Testing GitHub auth locally (on localhost)

1. Run `npm run generate:github` and follow the instructions there.
2. If your local website is already running, you will need to re-start it (re-`npm run start`)

# Manual-testing scenarios

Please see "[TESTING.md](TESTING.md)".

# Dev tips & tricks:

- `packages/common`:
  - When adding code to the `packages/common`, run `npm run build:package --workspace=common` in order to get Intellisense and the compiler to pick it up -- or just have `npm run start` already running and watching. In VS Code, you may need to `F12` into the file references before Intellisense is able to see the updated contents.
  - If typescript is failing to build with errors about missing values in common, you may be in a stale state. Try running `npm run clean` then `npm install` to force rebuild the common package.
- `packages/server`:
  - To debug server code, navigate to `chrome://inspect/` and choose your server node process from there. Note that if your code changes and `nodemon` reloads the server, you will need to close the Inspector tool and re-open again from the link above.
