import { SCRIPT_URLS } from 'common/lib/constants';
import { addScriptTags } from 'common/lib/utilities/script-loader';

import React, { Component } from 'react';

import App from './components/App';
import CustomFunctionsDashboard from './components/CustomFunctionsDashboard';

interface IState {
  hasLoadedScripts: boolean;
}

class CustomFunctions extends Component<{}, IState> {
  constructor(props: any) {
    super(props);
    addScriptTags([SCRIPT_URLS.OFFICE_JS_FOR_CUSTOM_FUNCTIONS_DASHBOARD])
      .then(() => Office.onReady())
      .then(() => {
        this.setState({ hasLoadedScripts: true });
        this.hideLoadingIndicator();
      });
  }

  hideLoadingIndicator() {
    const loadingIndicator = document.getElementById('loading')!;
    loadingIndicator.style.visibility = 'hidden';
  }

  render() {
    const Component = App(CustomFunctionsDashboard);
    return <Component />;
  }
}

export default CustomFunctions;
