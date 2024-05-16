import React from "react";

import App from "./components/App";
import CustomFunctionsDashboard from "./components/CustomFunctionsDashboard";
import Theme from "common/build/components/Theme";
import { Utilities } from "common/build/helpers/officeJsHost";

const CFD = App(CustomFunctionsDashboard);

interface IState {
  host: string;
}

class CustomFunctionsPage extends React.Component<{}, IState> {
  state: IState = { host: null };

  constructor(props: {}) {
    super(props);

    this.state = { host: Utilities.host };
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
