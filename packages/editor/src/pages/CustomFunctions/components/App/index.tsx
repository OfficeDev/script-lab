import React, { Component } from 'react';
import queryString from 'query-string';
import { IFunction } from 'custom-functions-metadata';
import {
  getCustomFunctionsInfoForRegistration,
  registerCustomFunctions,
  getCustomFunctionEngineStatusSafe,
  filterCustomFunctions,
} from './utilities';
import {
  getCustomFunctionCodeLastUpdated as getCFCodeLastModified,
  getCustomFunctionLogsFromLocalStorage,
} from 'common/lib/utilities/localStorage';
import { getLogsFromAsyncStorage } from './utilities/logs';
import { loadAllSolutionsAndFiles } from '../../../Editor/store/localStorage';
import {
  invokeGlobalErrorHandler,
  hideSplashScreen,
  showSplashScreen,
} from 'common/lib/utilities/splash.screen';
import { ScriptLabError } from 'common/lib/utilities/error';
import { JupyterNotebook, PythonCodeHelper } from 'common/lib/utilities/Jupyter';
import * as log from 'common/lib/utilities/log';
import generatePythonCFCode from '../../../../utils/custom-functions/generatePythonCFCode';
import { findScript } from '../../../../utils';

interface IState {
  runnerLastUpdated: number;
  customFunctionsSolutionLastModified: number;

  isStandalone: boolean;

  logs: ILogData[];
  error?: Error;

  // Optional, since cannot be immediately determined in the constructor
  engineStatus?: ICustomFunctionEngineStatus;
  customFunctionsSummaryItems?: Array<ICustomFunctionParseResult<any>>;
  customFunctionsCode?: string;
}

export interface IPropsToUI extends IState {
  fetchLogs: () => void;
  clearLogs: () => void;
}

const AppHOC = (UI: React.ComponentType<IPropsToUI>) =>
  class App extends Component<{}, IState> {
    private localStoragePollingInterval: any;

    constructor(props: {}) {
      super(props);

      this.state = {
        runnerLastUpdated: Date.now(),
        customFunctionsSolutionLastModified: getCFCodeLastModified(),
        isStandalone: !queryString.parse(window.location.href.split('?').slice(-1)[0])
          .backButton,
        logs: [],
      };
    }

    async componentDidMount() {
      try {
        const engineStatus = await getCustomFunctionEngineStatusSafe();

        const cfSolutions = getCustomFunctionsSolutions();
        const registrationResult = await getRegistrationResult(cfSolutions);
        this.setState({
          engineStatus: engineStatus,
          customFunctionsSummaryItems: registrationResult.parseResults,
          customFunctionsCode: registrationResult.code,
        });

        if (this.state.customFunctionsSummaryItems.length > 0) {
          await registerCustomFunctions(
            this.state.customFunctionsSummaryItems,
            this.state.customFunctionsCode,
          );
        }

        hideSplashScreen();
      } catch (e) {
        invokeGlobalErrorHandler(e);
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
      if (!this.state.engineStatus) {
        return;
      }

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

async function getRegistrationResult(
  cfSolutions: ISolution[],
): Promise<{ parseResults: Array<ICustomFunctionParseResult<IFunction>>; code: string }> {
  const pythonCFs = cfSolutions
    .map(solution => ({ solution, script: findScript(solution) }))
    .filter(({ script }) => script.language === 'python')
    .map(pair => pair.solution);

  if (pythonCFs.length > 0) {
    return getRegistrationResultPython(pythonCFs);
  } else {
    return getCustomFunctionsInfoForRegistration(cfSolutions);
  }
}

async function getRegistrationResultPython(
  pythonCFs: ISolution[],
): Promise<{
  parseResults: Array<ICustomFunctionParseResult<IFunction>>;
  code: string;
}> {
  const userSettings = JSON.parse(localStorage.getItem('userSettings') || '{}');
  const [url, token, notebookName] = ['jupyter.url', 'jupyter.token', 'jupyter.notebook']
    .map(settingName => ({
      name: settingName,
      value: userSettings[settingName],
    }))
    .map(pair => {
      if (!pair.value || (pair.value as string).trim().length === 0) {
        throw new ScriptLabError(
          `To support Python custom functions, you must ` +
            `enter the required settings in the editor's "Settings" page. ` +
            `Please close this pane, add the necessary settings, and try again.`,
          null,
          { hideCloseButton: true },
        );
      }
      return pair.value;
    });

  const clearOnRegister: boolean = userSettings['jupyter.clearOnRegister'] || false;

  const notebook = new JupyterNotebook({ baseUrl: url, token: token }, notebookName);
  showSplashScreen(
    `Attempting to connect to your Jupyter notebook, to allow execution of Python custom functions. Please wait...`,
  );

  try {
    const code = generatePythonCFCode(pythonCFs, { clearOnRegister });

    if (log.isLoggerEnabled('Jupyter', log.levels.INFO)) {
      console.log(code);
    }

    const result: ICustomFunctionsRegistrationApiMetadata<IFunction> = JSON.parse(
      PythonCodeHelper.parseFromPythonLiteral(await notebook.executeCode(code)),
    );

    const parseResults = result.functions.map(
      (metadata): ICustomFunctionParseResult<IFunction> => {
        return {
          javascriptFunctionName: null,
          nonCapitalizedFullName: metadata.name,
          metadata: { ...metadata, name: metadata.name.toUpperCase() },
          status: 'good', // Note: assuming success only
        };
      },
    );

    return {
      code: '',
      parseResults,
    };
  } catch (e) {
    invokeGlobalErrorHandler(
      new ScriptLabError(
        'Could not connect to Jupyter notebook. ' +
          `Please ensure that you've entered the correct Jupyter settings and that Jupyter is running`,
        e,
      ),
    );
    return { code: '', parseResults: [] };
  }
}
