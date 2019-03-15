import { SCRIPT_URLS } from 'common/lib/constants';
import { addScriptTags } from 'common/lib/utilities/script-loader';

import React from 'react';

import App from './components/App';
import CustomFunctionsDashboard from './components/CustomFunctionsDashboard';
import Theme from 'common/lib/components/Theme';
import { Utilities } from '@microsoft/office-js-helpers';
import { hideSplashScreen } from 'common/lib/utilities/splash.screen';
import { ensureOfficeReadyAndRedirectIfNeeded } from 'common/lib/utilities/environment.redirector';

const CFD = App(CustomFunctionsDashboard);

interface IState {
  host: string;
}

class CustomFunctionsPage extends React.Component<{}, IState> {
  state: IState = { host: null };

  constructor(props) {
    super(props);

    addScriptTags([SCRIPT_URLS.OFFICE_JS_FOR_CUSTOM_FUNCTIONS_DASHBOARD])
      .then(() =>
        ensureOfficeReadyAndRedirectIfNeeded({
          isMainDomain: true /* true for the Editor */,
        }),
      )
      .then(() => {
        // Note: though could get the host information from "Office.onReady",
        // the rest of the application thinks of the host value in terms of the
        // OfficeJsHelpers string for host (which is all-caps).
        // So go ahead and invoke the helper here to be consistent.
        this.setState({ host: Utilities.host });
      })
      .then(() => hideSplashScreen());
  }

  render() {
    if (!this.state.host) {
      return null;
    }

    return (
      <Theme host={this.state.host}>
        <CFD />
      </Theme>
    );
  }
}

export default CustomFunctionsPage;
