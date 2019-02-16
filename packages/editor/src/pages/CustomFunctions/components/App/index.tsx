import React, { Component } from 'react';
import queryString from 'query-string';
import flatten from 'lodash/flatten';
import {
  getCustomFunctionsInfoForRegistrationFromSolutions as getCFInfoForRegistration,
  getSummaryItems,
  registerMetadata,
  getCustomFunctionEngineStatusSafe,
  filterCustomFunctions,
} from './utilities';
import {
  getCustomFunctionCodeLastUpdated as getCFCodeLastModified,
  getCustomFunctionLogsFromLocalStorage,
} from 'common/lib/utilities/localStorage';
import { getLogsFromAsyncStorage } from './utilities/logs';
import { loadAllSolutionsAndFiles } from '../../../Editor/store/localStorage';
import { ScriptLabError } from 'common/lib/utilities/error';

interface IState {
  hasCustomFunctionsInSolutions: boolean;
  customFunctionsSummaryItems: ICustomFunctionSummaryItem[] | null;
  runnerLastUpdated: number;
  customFunctionsSolutionLastModified: number;

  isStandalone: boolean;
  engineStatus: ICustomFunctionEngineStatus | null;

  logs: ILogData[];
  error?: Error;
}

export interface IPropsToUI extends IState {
  fetchLogs: () => void;
  clearLogs: () => void;
}

const AppHOC = (UI: React.ComponentType<IPropsToUI>) =>
  class App extends Component<{}, IState> {
    private localStoragePollingInterval: any;
    private cfSolutions: ISolution[];

    constructor(props: {}) {
      super(props);

      this.cfSolutions = getCustomFunctionsSolutions();
      const hasCustomFunctionsInSolutions = this.cfSolutions.length > 0;

      this.state = {
        hasCustomFunctionsInSolutions,
        runnerLastUpdated: Date.now(),
        customFunctionsSolutionLastModified: getCFCodeLastModified(),
        isStandalone: !queryString.parse(window.location.href.split('?').slice(-1)[0])
          .backButton,
        customFunctionsSummaryItems: null,
        engineStatus: null,
        logs: [],
      };
    }

    async componentDidMount() {
      const engineStatus = await getCustomFunctionEngineStatusSafe();
      this.setState({ engineStatus: engineStatus });

      try {
        if (this.state.hasCustomFunctionsInSolutions) {
          const metadata = await this.fetchAndRegisterMetadata(this.cfSolutions);
          this.setState({ customFunctionsSummaryItems: getSummaryItems(metadata) });
        }
      } catch (e) {
        this.setState({
          error: e,
        });
      }

      this.localStoragePollingInterval = setInterval(
        () =>
          this.setState({
            customFunctionsSolutionLastModified: getCFCodeLastModified(),
          }),
        500,
      );
    }

    componentWillUnmount() {
      clearInterval(this.localStoragePollingInterval);
    }

    fetchLogs = async () => {
      const isUsingAsyncStorage =
        !!this.state.engineStatus.nativeRuntime &&
        (window as any).Office &&
        (window as any).Office.context &&
        (window as any).Office.context.requirements &&
        (window as any).Office.context.requirements.isSetSupported(
          'CustomFunctions',
          1.4,
        );

      const logs: ILogData[] = isUsingAsyncStorage
        ? await getLogsFromAsyncStorage()
        : getCustomFunctionLogsFromLocalStorage();

      this.setState({ logs: [...this.state.logs, ...logs] });
    };

    clearLogs = () => this.setState({ logs: [] });

    private async fetchAndRegisterMetadata(
      solutions: ISolution[],
    ): Promise<ICFVisualSnippetMetadata[]> {
      try {
        const { visual, code } = getCFInfoForRegistration(solutions);

        const allFunctions: ICFVisualFunctionMetadata[] = flatten(
          visual.snippets.map(snippet => snippet.functions),
        );

        await registerMetadata(allFunctions, code);

        return visual.snippets;
      } catch (e) {
        console.error(e);
        throw new ScriptLabError('Could not register Custom Functions', e);
      }
    }

    render() {
      return <UI {...this.state} fetchLogs={this.fetchLogs} clearLogs={this.clearLogs} />;
    }
  };

export default AppHOC;

///////////////////////////////////////

function getCustomFunctionsSolutions(): ISolution[] {
  const { solutions: allSolutions, files: allFiles } = loadAllSolutionsAndFiles();

  const solutions = Object.values(allSolutions).map(solution => {
    const files = Object.values(allFiles).filter(file =>
      solution.files.includes(file.id),
    );

    return { ...solution, files };
  });

  return filterCustomFunctions(solutions);
}
