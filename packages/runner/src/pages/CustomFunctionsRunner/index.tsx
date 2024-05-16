import React from "react";

import { RunOnLoad } from "common/build/components/PageSwitcher/utilities/RunOnLoad";
import setup from "./setup";

export const CustomFunctionsRunner = () => (
  /* NOTE: This page will wait to load the script tag for "custom-functions-runtime.js"
     until it hears back from the heartbeat, to check whether there is python support */
  <RunOnLoad funcToRun={setup} />
);
