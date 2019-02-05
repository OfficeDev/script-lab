import React, { useEffect } from 'react';
import { currentRunnerUrl } from 'common/lib/environment';

const CustomFunctionsRun = () => {
  useEffect(() => {
    window.location.href = `${currentRunnerUrl}/#/custom-functions`;
  });

  return null;
};

export default CustomFunctionsRun;
