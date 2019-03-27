import { SCRIPT_URLS } from 'common/lib/constants';
import { addScriptTags } from 'common/lib/utilities/script-loader';

import React, { Component } from 'react';
import App from './components/App';

// redux
import { Store } from 'redux';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import {
  loadState as loadStateFromLocalStorage,
  saveState as saveStateToLocalStorage,
} from './store/localStorage';
import {
  loadState as loadStateFromSessionStorage,
  saveState as saveStateToSessionStorage,
} from './store/sessionStorage';

import throttle from 'lodash/throttle';
import { ScriptLabError } from 'common/lib/utilities/error';
import { invokeGlobalErrorHandler } from 'common/lib/utilities/splash.screen';
import {
  initializeTelemetryLogger,
  sendTelemetryEvent,
} from 'common/lib/utilities/telemetry';

interface IState {
  hasLoadedScripts: boolean;
  store?: Store;
}

class Editor extends Component<{}, IState> {
  state: IState = { hasLoadedScripts: false };

  constructor(props: any) {
    super(props);
    addScriptTags([SCRIPT_URLS.MONACO_LOADER])
      .then(() => Office.onReady())
      .then(() => initializeTelemetryLogger())
      .then(() => ensureProperOfficeBuildIfRelevant())
      .then(() => loadStateFromLocalStorage())
      .then(localStorageState => {
        const store = configureStore({
          initialState: {
            ...localStorageState,
            ...loadStateFromSessionStorage(),
          },
        });

        store.subscribe(
          throttle(() => {
            const state = store.getState();
            saveStateToLocalStorage(state);
            saveStateToSessionStorage(state);
          }, 1000),
        );

        sendTelemetryEvent('Editor.Loaded', []);

        this.setState({ hasLoadedScripts: true, store });
      });
  }

  render() {
    const { hasLoadedScripts, store } = this.state;
    return hasLoadedScripts ? (
      <Provider store={store}>
        <App />
      </Provider>
    ) : null;
  }
}

export default Editor;

///////////////////////////////////////

async function ensureProperOfficeBuildIfRelevant() {
  const hostInfo = await Office.onReady();
  if (hostInfo.host && hostInfo.platform === Office.PlatformType.PC) {
    if (isO16orHigher()) {
      // For Office 2016 MSI, need to have a build that supports the "GetHostInfo" API.
      // Otherwise, the code will never run, because switching to the runner domain will lose the host info.
      try {
        (window.external as any).GetHostInfo();
      } catch (e) {
        invokeGlobalErrorHandler(
          // Note: we're still allowing the user to close out of the error and see the editor,
          //   hence the text talks specifically about Script Lab needing the Office update
          //   for *running* the snippets.  However, still showing it in the editor,
          //   since want the developer to get onto the path of success (go update) as soon as possible.
          new ScriptLabError(
            'Office Update Required',
            `Your Office version is missing important updates, and Script Lab snippets ` +
              `won't be able to run until you install those updates. ` +
              `To install, please follow the instructions at ` +
              `https://docs.microsoft.com/en-us/officeupdates/office-updates-msi`,
          ),
        );
      }
    }
  }

  /////////////////////////////////////

  function isO16orHigher(): boolean {
    const hasVersion =
      Office &&
      Office.context &&
      Office.context.diagnostics &&
      Office.context.diagnostics.version;
    if (hasVersion) {
      const versionString = Office.context.diagnostics.version;
      const num = Number.parseInt(
        versionString.substr(0, versionString.indexOf('.')),
        10,
      );
      return num >= 16;
    }

    // The only hosts that don't support Office.context.diagnostics.version are the 2016 hosts that
    //     still use the non-updated "16.00" files (by contrast, 15.XX files do support it)
    // So it's actually a giveaway that they *are* O16.
    return true;
  }
}
