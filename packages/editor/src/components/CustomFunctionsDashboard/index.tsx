import React from 'react';

import Dashboard from './Dashboard';

import Summary from './Summary';
import Console from './Console';

import ComingSoon from './ComingSoon';
import Welcome from './Welcome';

import { connect } from 'react-redux';
import selectors from '../../store/selectors';

import { misc } from '../../store/actions';
import { getCustomFunctionEngineStatus } from '../../store/customFunctions/utilities';

interface IPropsFromRedux {
  hasCustomFunctionsInSolutions: boolean;
  runnerLastUpdated: number;
  customFunctionSolutionLastModified: number;
}

const mapStateToProps = (state): IPropsFromRedux => ({
  hasCustomFunctionsInSolutions: selectors.customFunctions.getSolutions(state).length > 0,
  runnerLastUpdated: state.customFunctions.runner.lastUpdated,
  customFunctionSolutionLastModified: selectors.customFunctions.getLastModifiedDate(
    state,
  ),
});

interface IActionsFromRedux {
  hideLoadingSplashScreen: () => void;
}

const mapDispatchToProps = (dispatch): IActionsFromRedux => ({
  hideLoadingSplashScreen: () => dispatch(misc.hideLoadingSplashScreen()),
});

interface IProps extends IPropsFromRedux, IActionsFromRedux {}

interface IState {
  engineStatus: ICustomFunctionEngineStatus | null;
}

export class CustomFunctionsDashboard extends React.Component<IProps, IState> {
  state: IState = { engineStatus: null };

  constructor(props) {
    super(props);

    getCustomFunctionEngineStatus().then(status => {
      if (status) {
        this.setState({ engineStatus: status });
        this.props.hideLoadingSplashScreen();
      }
    });
  }

  getShouldPromptRefresh = () =>
    this.props.customFunctionSolutionLastModified > this.props.runnerLastUpdated;

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
