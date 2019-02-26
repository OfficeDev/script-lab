import React from 'react';
import styled from 'styled-components';
import { Utilities, HostType } from '@microsoft/office-js-helpers';
import queryString from 'query-string';
import cloneDeep from 'lodash/cloneDeep';

import Theme from 'common/lib/components/Theme';
import Console from 'common/lib/components/Console';
import HeaderFooterLayout from 'common/lib/components/HeaderFooterLayout';
import { SCRIPT_URLS } from 'common/lib/constants';
import { OFFICE_JS_URL_QUERY_PARAMETER_KEY } from 'common/lib/utilities/script-loader/constants';

import Heartbeat from './Heartbeat';
import Header from './Header';
import Footer from './Footer';
import Only from 'common/lib/components/Only';

import SnippetContainer from '../SnippetContainer';
import { currentEditorUrl } from 'common/lib/environment';
import processLibraries from 'common/lib/utilities/process.libraries';
import { showSplashScreen, hideSplashScreen } from 'common/lib/utilities/splash.screen';
import { openPopoutCodeEditor } from 'common/lib/utilities/popout.control';
import { SILENT_SNIPPET_SWITCHING } from '../../../../constants';

const AppWrapper = styled.div`
  height: 100vh;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

let logCount = 0;

interface IState {
  solution?: ISolution | null;
  lastRendered: number | null;
  logs: ILogData[];
  isConsoleOpen: boolean;
}

export class App extends React.Component<{}, IState> {
  private officeJsPageUrlLowerCased: string | null;
  private hasRenderedContent = false;
  private isTransitioningAwayFromPage = false;

  constructor(props: {}) {
    super(props);

    this.state = {
      solution: undefined,
      logs: [],
      isConsoleOpen: false,
      lastRendered: null,
    };

    const params = queryString.parse(window.location.search) as {
      [OFFICE_JS_URL_QUERY_PARAMETER_KEY]: string;
    };
    this.officeJsPageUrlLowerCased =
      Utilities.host === HostType.WEB
        ? null
        : (
            params[OFFICE_JS_URL_QUERY_PARAMETER_KEY] || SCRIPT_URLS.DEFAULT_OFFICE_JS
          ).toLowerCase();
  }

  componentDidMount() {
    this.monkeypatchConsole();
  }

  monkeypatchConsole = () => {
    ['info', 'warn', 'error', 'log'].forEach(method => {
      const oldMethod = window.console[method];
      window.console[method] = (...args: any[]) => {
        try {
          // For some reason, in IE, calling the old method results in an error:
          // "JavaScript runtime error: Invalid calling object".  Hence putting it into the try/catch as well.
          oldMethod(...args);
        } catch (e) {
          // Silently ignore.  We'll still get notified via the UI anyway!
        }

        args.forEach(object =>
          /* Note, the setTimeout is critical to make sure the UI doesn't freeze! */
          setTimeout(
            () =>
              this.addLog({
                severity: method as ConsoleLogTypes,
                object,
              }),
            0,
          ),
        );
      };
    });
  };

  addLog = ({
    severity,
    object,
  }: {
    severity: ConsoleLogTypes;
    object: string | { [key: string]: any };
  }) => {
    object = possiblyMassageObject(object);

    this.setState({
      logs: [...this.state.logs, { id: logCount.toString(), message: object, severity }],
      isConsoleOpen: true,
    });
    logCount++;
  };

  clearLogs = () => this.setState({ logs: [] });

  openConsole = () => this.setState({ isConsoleOpen: true });
  closeConsole = () => this.setState({ isConsoleOpen: false });

  openCode = () => openPopoutCodeEditor();

  onReceiveNewActiveSolution = (solution: ISolution | null) => {
    if (solution !== null) {
      this.respondToOfficeJsMismatchIfAny(solution);

      if (!this.state.solution) {
        informSnippetSwitch(`Your snippet "${solution.name}" has been loaded.`);
      } else {
        informSnippetSwitch(`Switching to snippet "${solution.name}".`);
      }
    }
    this.setState({ solution, logs: [] });
  };

  softRefresh = () => {
    if (this.state.solution) {
      this.setState({
        solution: { ...this.state.solution, dateLastModified: Date.now() },
        logs: [],
      });
      informSnippetSwitch(
        `Your snippet '${this.state.solution.name}' has been reloaded.`,
      );
    }
  };

  reloadPage = () => {
    this.reloadPageWithDifferentOfficeJsUrl(null);
  };

  onSnippetRender = ({
    lastRendered,
    hasContent,
  }: {
    lastRendered: number;
    hasContent: boolean;
  }) => {
    // If staying on this page (rather than being in the process of reloading)
    if (!this.isTransitioningAwayFromPage) {
      this.setState({ lastRendered });

      if (hasContent) {
        this.hasRenderedContent = true;

        // Also, hide the loading indicators, if they were still up
        hideSplashScreen();
      }
    }
  };

  render() {
    return (
      <Theme host={this.state.solution ? this.state.solution.host : Utilities.host}>
        <AppWrapper>
          <HeaderFooterLayout
            wrapperStyle={{ flex: '6', minHeight: '30rem' }}
            header={
              <Header
                solution={this.state.solution}
                refresh={this.softRefresh}
                hardRefresh={this.reloadPage}
                goBack={
                  !!queryString.parse(window.location.search).backButton
                    ? () => (window.location.href = currentEditorUrl)
                    : undefined
                }
                openCode={this.openCode}
              />
            }
            footer={
              <Footer
                isConsoleOpen={this.state.isConsoleOpen}
                openConsole={this.openConsole}
                closeConsole={this.closeConsole}
                isSolutionLoaded={!!this.state.solution}
                lastRendered={this.state.lastRendered}
                refresh={this.softRefresh}
              />
            }
          >
            <SnippetContainer
              solution={this.state.solution}
              onRender={this.onSnippetRender}
            />
          </HeaderFooterLayout>
          <Only when={this.state.isConsoleOpen}>
            <Console
              style={{ flex: '4', minHeight: '5rem' }}
              logs={this.state.logs}
              clearLogs={this.clearLogs}
            />
          </Only>
        </AppWrapper>
        <Heartbeat
          host={Utilities.host}
          onReceiveNewActiveSolution={this.onReceiveNewActiveSolution}
        />
      </Theme>
    );
  }

  /////////////////////////

  // Note: need a separate helper function rather than re-using
  // the "reloadPage", because that one is used by a click handler --
  // and thus will get invoked with an object-based click-event parameter
  // rather than a string, messing up the reload.
  private reloadPageWithDifferentOfficeJsUrl(newOfficeJsUrl: string | null) {
    const currentQueryParams: { [key: string]: any } = queryString.parse(
      window.location.search,
    );

    const isDifferentOfficeJs =
      newOfficeJsUrl &&
      newOfficeJsUrl !== currentQueryParams[OFFICE_JS_URL_QUERY_PARAMETER_KEY];

    if (isDifferentOfficeJs) {
      const newParams = {
        ...currentQueryParams,
        [OFFICE_JS_URL_QUERY_PARAMETER_KEY]: newOfficeJsUrl,
      };

      // Set the search, which will force a reload
      window.location.search = queryString.stringify(newParams);
    } else {
      window.location.reload();
    }
  }

  private respondToOfficeJsMismatchIfAny(solution: ISolution) {
    const librariesFile = solution.files.find(file => file.name === 'libraries.txt');
    if (!librariesFile) {
      return;
    }

    const newOfficeJsUrl = processLibraries(
      librariesFile.content,
      Utilities.host !== HostType.WEB /*isInsideOffice*/,
    ).officeJs;

    const isMismatched = (() => {
      if (this.officeJsPageUrlLowerCased && newOfficeJsUrl) {
        return this.officeJsPageUrlLowerCased !== newOfficeJsUrl.toLowerCase();
      }

      return false;
    })();

    if (isMismatched) {
      // On reloading Office.js (and if had already shown a snippet before),
      // show a visual indication to explain the reload.
      // Otherwise, if hasn't rendered any snippet before (i.e., it's a first navigation,
      // straight to an office.js beta snippet, don't change out the title, keep as is
      // so that the load appears continuous).
      if (this.hasRenderedContent) {
        showSplashScreen('Re-loading office.js, please wait...');
      }

      this.isTransitioningAwayFromPage = true;
      this.reloadPageWithDifferentOfficeJsUrl(newOfficeJsUrl!);
    }
  }
}

function informSnippetSwitch(message: string) {
  if (!SILENT_SNIPPET_SWITCHING) {
    console.log(message);
  }
}

function possiblyMassageObject(object: any): any {
  // For ClientResult objects, create a snapshot, so that the console output doesn't get modified later
  //     when the object resolves itself (both in UI and in copy-to-clipboard)
  // Arguably, this should be the case with the other objects as well, but it gets harder to do
  //    (circular references and etc.)
  // Whereas fixing it for ClientResult is easy-to-fix, and has more visible results:
  if (
    typeof OfficeExtension !== 'undefined' &&
    object instanceof OfficeExtension.ClientResult
  ) {
    return getDataForClientResult(object);
  }

  return object;
}

function getDataForClientResult(
  result: OfficeExtension.ClientResult<any>,
): { value: any } {
  let value: any;
  try {
    value = cloneDeep(result.value);
  } catch (e) {
    value = '<Could not read the value. You must first call `context.sync()`.';
  }

  return { value: value };
}

export default App;
