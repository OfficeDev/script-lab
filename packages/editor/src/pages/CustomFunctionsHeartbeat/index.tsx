import React from "react";

import { RunOnLoad } from "common/build/components/PageSwitcher/utilities/RunOnLoad";
import setup from "./setup";

const CustomFunctionsHeartbeat = () => <RunOnLoad funcToRun={setup} />;

export default CustomFunctionsHeartbeat;
