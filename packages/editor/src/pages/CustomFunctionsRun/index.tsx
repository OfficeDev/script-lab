import { useEffect } from "react";
import { currentRunnerUrl } from "common/build/environment";

const CustomFunctionsRun = () => {
  useEffect(() => {
    window.location.href = `${currentRunnerUrl}/index.html#/custom-functions`;
  });

  return null;
};

export default CustomFunctionsRun;
