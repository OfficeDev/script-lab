import React from 'react';

import Dashboard from '../Dashboard';

import Summary from '../Summary';
import Metadata from '../Metadata';
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
      customFunctionsSummaryItems,
      isStandalone,
      engineStatus,
      logs,
      fetchLogs,
      clearLogs,
      error,
    } = this.props;

    if (!engineStatus) {
      return null;
    } else if (engineStatus!.enabled) {
      return (
        <Dashboard
          isStandalone={isStandalone}
          hasAny={customFunctionsSummaryItems.length > 0}
          items={{
            Summary: <Summary items={customFunctionsSummaryItems} error={error} />,
            Metadata: <Metadata items={customFunctionsSummaryItems} />,
            Console: <Console logs={logs} fetchLogs={fetchLogs} clearLogs={clearLogs} />,
          }}
          shouldPromptRefresh={this.getShouldPromptRefresh()}
        />
      );
    } else {
      return <ComingSoon />;
    }
  }
}

export default CustomFunctionsDashboard;
