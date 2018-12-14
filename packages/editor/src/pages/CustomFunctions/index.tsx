import React, { useEffect } from 'react';
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
