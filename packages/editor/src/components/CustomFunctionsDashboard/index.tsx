import React from 'react';

import Dashboard from './Dashboard';

import Summary from './Summary';
import Console from './Console';

import ComingSoon from './ComingSoon';
import Welcome from './Welcome';

import { connect } from 'react-redux';
import selectors from '../../store/selectors';
import { IState as IReduxState } from '../../store/reducer';

import { misc, IRootAction } from '../../store/actions';
import { getCustomFunctionEngineStatus } from '../../store/customFunctions/utilities';
import { getCustomFunctionCodeLastUpdated } from 'common/lib/utilities/localStorage';
import { Dispatch } from 'redux';

interface IPropsFromRedux {
  hasCustomFunctionsInSolutions: boolean;
  runnerLastUpdated: number;
}

const mapStateToProps = (state: IReduxState): IPropsFromRedux => ({
  hasCustomFunctionsInSolutions: selectors.customFunctions.getSolutions(state).length > 0,
  runnerLastUpdated: state.customFunctions.runner.lastUpdated,
});

interface IActionsFromRedux {
  hideLoadingSplashScreen: () => void;
}

const mapDispatchToProps = (dispatch: Dispatch<IRootAction>): IActionsFromRedux => ({
  hideLoadingSplashScreen: () => dispatch(misc.hideLoadingSplashScreen()),
});

interface IProps extends IPropsFromRedux, IActionsFromRedux {}

interface IState {
  customFunctionsSolutionLastModified: number;
  engineStatus: ICustomFunctionEngineStatus | null;
}

export class CustomFunctionsDashboard extends React.Component<IProps, IState> {
  localStoragePollingInterval: any;
  state: IState = {
    engineStatus: null,
    customFunctionsSolutionLastModified: getCustomFunctionCodeLastUpdated(),
  };

  constructor(props: IProps) {
    super(props);

    getCustomFunctionEngineStatus().then(status => {
      if (status) {
        this.setState({ engineStatus: status });
        this.props.hideLoadingSplashScreen();
      }
    });
  }

  componentDidMount() {
    this.localStoragePollingInterval = setInterval(
      () =>
        this.setState({
          customFunctionsSolutionLastModified: getCustomFunctionCodeLastUpdated(),
        }),
      500,
    );
  }

  componentWillUnmount() {
    clearInterval(this.localStoragePollingInterval);
  }

  getShouldPromptRefresh = () => {
    return this.state.customFunctionsSolutionLastModified > this.props.runnerLastUpdated;
  };

  render() {
    const { hasCustomFunctionsInSolutions } = this.props;

    if (!this.state.engineStatus) {
      return <></>;
    } else if (this.state.engineStatus!.enabled) {
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
