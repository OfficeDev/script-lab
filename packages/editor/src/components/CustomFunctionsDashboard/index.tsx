import React from 'react';

import Dashboard from './Dashboard';

import Summary from './Summary';
import Console from './Console';

import ComingSoon from './ComingSoon';
import Welcome from './Welcome';

import { connect } from 'react-redux';
import selectors from '../../store/selectors';

import { localStorageKeys } from '../../constants';
import { customFunctions } from '../../store/actions';
import { getCustomFunctionEngineStatus } from '../../utils/customFunctions';

interface IPropsFromRedux {
  hasCustomFunctionsInSolutions: boolean;
  runnerLastUpdated: number;
}

const mapStateToProps = (state): IPropsFromRedux => ({
  hasCustomFunctionsInSolutions: selectors.customFunctions.getSolutions(state).length > 0,
  runnerLastUpdated: state.customFunctions.runner.lastUpdated,
});

interface IActionsFromRedux {
  onLoadComplete: () => void;
}

const mapDispatchToProps = (dispatch): IActionsFromRedux => ({
  onLoadComplete: () => dispatch(customFunctions.onLoadComplete()),
});

interface IProps extends IPropsFromRedux, IActionsFromRedux {}

interface IState {
  engineStatus: ICustomFunctionEngineStatus | null;
  customFunctionsLastModified: number;
}

export class CustomFunctionsDashboard extends React.Component<IProps, IState> {
  localStorageCheckInterval;
  state: IState = { engineStatus: null, customFunctionsLastModified: 0 };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    getCustomFunctionEngineStatus().then(status => {
      if (status) {
        this.setState({ engineStatus: status });

        this.props.onLoadComplete();

        this.localStorageCheckInterval = setInterval(
          this.getCustomFunctionsLastModified,
          1000,
        );
      }
    });
  }

  componentWillUnmount() {
    clearInterval(this.localStorageCheckInterval);
  }

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
    const { hasCustomFunctionsInSolutions } = this.props;

    if (!this.state.engineStatus) {
      return <></>;
    } else if (this.state.engineStatus.enabled) {
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CustomFunctionsDashboard);
