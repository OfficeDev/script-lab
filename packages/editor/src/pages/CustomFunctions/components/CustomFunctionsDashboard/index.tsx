import React from 'react';

import Dashboard from '../Dashboard';

import Summary from '../Summary';
import Console from '../Console';

import ComingSoon from '../ComingSoon';
import Welcome from '../Welcome';

import { IPropsToUI as IProps } from '../App';

export class CustomFunctionsDashboard extends React.Component<IProps> {
  getShouldPromptRefresh = () => {
    return this.props.customFunctionsSolutionLastModified > this.props.runnerLastUpdated;
  };

  render() {
    const {
      hasCustomFunctionsInSolutions,
      customFunctionsSummaryItems,
      isStandalone,
      engineStatus,
      logs,
      fetchLogs,
      clearLogs,
    } = this.props;

    if (!engineStatus) {
      return null;
    } else if (engineStatus!.enabled) {
      if (hasCustomFunctionsInSolutions) {
        return (
          <Dashboard
            isStandalone={isStandalone}
            items={{
              Summary: <Summary items={customFunctionsSummaryItems} />,
              Console: (
                <Console logs={logs} fetchLogs={fetchLogs} clearLogs={clearLogs} />
              ),
            }}
            shouldPromptRefresh={this.getShouldPromptRefresh()}
          />
        );
      } else {
        return <Welcome isRefreshEnabled={this.getShouldPromptRefresh()} />;
      }
    } else {
      return <ComingSoon />;
    }
  }
}

export default CustomFunctionsDashboard;
