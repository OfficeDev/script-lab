import React from 'react';

import Dashboard from './Dashboard';

import Summary from './Summary';
import Console from './Console';

import ComingSoon from './ComingSoon';
import Welcome from './Welcome';

import LoadingIndicator from 'common/lib/components/LoadingIndicator';

import { connect } from 'react-redux';
import selectors from '../../store/selectors';

import { getIsCustomFunctionsSupportedOnHost } from '../../utils/customFunctions';
import { localStorageKeys } from '../../constants';

interface IPropsFromRedux {
  hasCustomFunctionsInSolutions: boolean;
  runnerLastUpdated: number;
}

const mapStateToProps = (state): IPropsFromRedux => ({
  hasCustomFunctionsInSolutions: selectors.customFunctions.getSolutions(state).length > 0,
  runnerLastUpdated: state.customFunctions.runner.lastUpdated,
});

interface IProps extends IPropsFromRedux {}

interface IState {
  isCFSupportedOnHost: boolean | undefined;
  customFunctionsLastModified: number;
}

export class CustomFunctionsDashboard extends React.Component<IProps, IState> {
  localStorageCheckInterval;
  state = { isCFSupportedOnHost: undefined, customFunctionsLastModified: 0 };

  constructor(props) {
    super(props);

    getIsCustomFunctionsSupportedOnHost().then((isCFSupportedOnHost: boolean) => {
      this.setState({ isCFSupportedOnHost });
    });
  }

  componentDidMount() {
    this.localStorageCheckInterval = setInterval(
      this.getCustomFunctionsLastModified,
      1000,
    );
  }

  componentWillUnmount = () => {
    clearInterval(this.localStorageCheckInterval);
  };

  getShouldPromptRefresh = () =>
    this.state.customFunctionsLastModified > this.props.runnerLastUpdated;

  getCustomFunctionsLastModified = () =>
    this.setState({
      customFunctionsLastModified:
        Number(
          localStorage.getItem(localStorageKeys.customFunctionsLastUpdatedCodeTimestamp),
        ) || 0,
    });

  render() {
    const { isCFSupportedOnHost } = this.state;
    const { hasCustomFunctionsInSolutions } = this.props;

    if (isCFSupportedOnHost === undefined) {
      return (
        <div style={{ width: '100vw', height: '100vh' }}>
          <LoadingIndicator ballSize={32} numBalls={5} ballColor="#d83b01" delay={0.05} />
        </div>
      );
    } else if (isCFSupportedOnHost) {
      if (hasCustomFunctionsInSolutions) {
        return (
          <Dashboard
            items={{ Summary: <Summary />, Console: <Console /> }}
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

export default connect(mapStateToProps)(CustomFunctionsDashboard);
