import React from "react";
import { RunOnLoad } from "common/build/components/PageSwitcher/utilities/RunOnLoad";
import setup from "./setup";

const AddinCommands = () => <RunOnLoad funcToRun={setup} />;

export default AddinCommands;
