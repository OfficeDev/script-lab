import React from 'react';

import Dashboard from '../Dashboard';

import Summary from '../Summary';
import Metadata from '../Metadata';
import Console from '../Console';

import ComingSoon from '../ComingSoon';

import { IPropsToUI as IProps } from '../App';

export class CustomFunctionsDashboard extends React.Component<IProps> {
  private logFetchInterval: any;

  componentDidMount() {
    this.logFetchInterval = setInterval(this.props.fetchLogs, 250);
  }

  componentWillUnmount() {
    clearInterval(this.logFetchInterval);
  }

  render() {
    const {
      customFunctionsSummaryItems,
      isStandalone,
      engineStatus,
      logs,
      clearLogs,
      error,
    } = this.props;

    if (!engineStatus) {
      return null;
    } else if (engineStatus!.enabled) {
      return (
        <Dashboard
          isStandalone={isStandalone}
          hasAny={customFunctionsSummaryItems && customFunctionsSummaryItems.length > 0}
          items={{
            Summary: {
              component: <Summary items={customFunctionsSummaryItems} error={error} />,
            },
            Metadata: {
              component: <Metadata items={customFunctionsSummaryItems} />,
            },
            Console: {
              component: <Console logs={logs} clearLogs={clearLogs} />,
              itemCount: logs.length > 0 ? logs.length : undefined,
            },
          }}
          shouldPromptRefresh={this.getShouldPromptRefresh()}
        />
      );
    } else {
      return <ComingSoon />;
    }
  }

  getShouldPromptRefresh = () => {
    return this.props.customFunctionsSolutionLastModified > this.props.runnerLastUpdated;
  };
}

export default CustomFunctionsDashboard;
