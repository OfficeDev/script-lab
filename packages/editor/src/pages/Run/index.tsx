import { useEffect } from "react";
import { currentRunnerUrl } from "common/build/environment";

const Run = () => {
  useEffect(() => {
    window.location.href = `${currentRunnerUrl}/index.html`;
  });

  return null;
};

export default Run;
