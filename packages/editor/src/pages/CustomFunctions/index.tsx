import React, { useEffect } from 'react';
import { currentRunnerUrl } from 'common/lib/environment';
import ensureFreshLocalStorage from 'common/lib/utilities/ensure.fresh.local.storage';
import App from './components/App';
import CustomFunctionsDashboard from './components/CustomFunctionsDashboard';

const CustomFunctions = () => {
  useEffect(() => {
    const loadingIndicator = document.getElementById('loading')!;
    loadingIndicator.style.visibility = 'hidden';
  });

  const Component = App(CustomFunctionsDashboard);

  return <Component />;
};

export default CustomFunctions;
