import React from 'react';

import IFrame from './IFrame';
import Only from 'common/lib/components/Only';

import runTemplate from './templates/run';
import errorTemplate from './templates/error';
import noSnippetTemplate from './templates/noSnippet';
import pythonTemplate from './templates/python';

import * as constants from '../../../../constants';
import { ProgressIndicator } from 'office-ui-fabric-react/lib/ProgressIndicator';
import { compileTypeScript, SyntaxError } from './utilities';
import untrusted from './templates/untrusted';
import { Utilities, HostType } from '@microsoft/office-js-helpers';
import processLibraries from 'common/lib/utilities/process.libraries';
import { sanitizeObject } from './templates/sanitizer';
import { findScript, findLibraries } from 'common/lib/utilities/solution';
import { IEditorHeartbeatToRunnerResponse } from 'common/lib/constants';
import { languageMapLowercased } from 'common/lib/languageMap';

const SHOW_PROGRESS_BAR_DURATION = 750 /* ms */;

export interface IProps {
  solution?: ISolution | null;
  onRender?: (data: { lastRendered: number; hasContent: boolean }) => void;
  sendMessageFromRunnerToEditor: (message: string) => void;
}

interface IState {
  isIFrameMounted: boolean;
  isLoading: boolean;
  isShowingProgressBar: boolean;
  content: string;
  lastRendered: number;
}

class Snippet extends React.Component<IProps, IState> {
  private iframeRef: React.RefObject<IFrame> = React.createRef();

  constructor(props: IProps) {
    super(props);

    const lastRendered = Date.now();
    const content = this.getContent(this.props);
    this.state = {
      content,
      lastRendered,
      isLoading: true,
      isShowingProgressBar: true,
      isIFrameMounted: false,
    };

    if (this.props.onRender) {
      this.props.onRender({ lastRendered, hasContent: content.length > 0 });
    }
  }

  passMessageThroughToIframe(message: IEditorHeartbeatToRunnerResponse) {
    this.iframeRef.current.passMessageThroughToIframe(message);
  }

  componentDidMount() {}

  componentDidUpdate(prevProps: IProps) {
    if (this.shouldUpdate(prevProps.solution, this.props.solution)) {
      const lastRendered = Date.now();

      this.setState(
        { isIFrameMounted: false, isLoading: true, isShowingProgressBar: true },
        () => {
          const content = this.getContent(this.props);

          if (this.props.onRender) {
            this.props.onRender({ lastRendered, hasContent: content.length > 0 });
          }

          return this.setState({
            content,
            lastRendered,
            isLoading: true,
            isIFrameMounted: true,
          });
        },
      );
    }
  }

  completeLoad = () => {
    this.setState({ isLoading: false });
    setTimeout(
      () => this.setState({ isShowingProgressBar: false }),
      SHOW_PROGRESS_BAR_DURATION,
    );
  };

  componentWillUnmount() {}

  getContent = ({ solution }: IProps): string => {
    if (solution === undefined) {
      return '';
    }

    if (solution === null) {
      return noSnippetTemplate();
    }

    if (solution.options.isUntrusted) {
      return untrusted({ snippetName: solution.name });
    }

    try {
      const script = findScript(solution);
      if (script.language === languageMapLowercased.python) {
        return pythonTemplate({ script: script.content });
      }

      // If the host is Outlook, add an ItemChanged event handler if one doesn't exist already
      if (
        Utilities.host === HostType.OUTLOOK &&
        (script.language === languageMapLowercased.typescript ||
          script.language === languageMapLowercased.javascript) &&
        script.content.indexOf('Office.EventType.ItemChanged') === -1
      ) {
        script.content = script.content + constants.itemChangedEventHandler.content;
      }

      // For the HTML, run it through the browser's DOM parser to get it to auto-add
      //    any closing tag, and to "normalize" it in a way that makes it cleanly-injectable
      //    into the "run" template ("templates/run.ts")
      //    We had issue https://github.com/OfficeDev/script-lab/issues/399,
      //    where the invalid HTML cause the script tag to be entirely skipped,
      //    when we didn't do this validation
      const html = (new DOMParser().parseFromString(
        solution.files.find(file => file.name === 'index.html')!.content,
        'text/html',
      ).firstChild.childNodes[1] as HTMLElement).innerHTML;

      const inlineStyles = solution.files.find(file => file.name === 'index.css')!
        .content;

      const inlineScript = compileTypeScript(script.content);

      const libraries = findLibraries(solution)!.content;
      const { linkReferences, scriptReferences } = processLibraries(
        libraries,
        Utilities.host !== HostType.WEB /* isInsideOffice*/,
      );

      return runTemplate({
        linkReferences,
        scriptReferences,
        inlineScript,
        inlineStyles,
        html,
      });
    } catch (error) {
      return errorTemplate({
        ...sanitizeObject({
          title: error instanceof SyntaxError ? 'Syntax Error' : 'Unknown Error',
          details: (error as { message: string }).message,
        }),
        usePreBlock: true,
      });
    }
  };

  render() {
    return (
      <>
        <Only when={this.state.isShowingProgressBar}>
          <ProgressIndicator
            styles={{
              itemProgress: { padding: '1px', height: '5px', zIndex: 1000 },
              root: {
                height: '10px',
                width: '100%',
                position: 'absolute',
              },
              progressTrack: {
                height: '5px',
              },
              progressBar: {
                height: '5px',
              },
            }}
          />
        </Only>

        <div style={{ display: this.state.isLoading ? 'none' : 'block', height: '100%' }}>
          {this.state.isIFrameMounted && (
            <IFrame
              ref={this.iframeRef}
              content={this.state.content}
              lastRendered={this.state.lastRendered}
              namespacesToTransferFromWindow={constants.officeNamespacesForIframe}
              onRenderComplete={this.completeLoad}
              sendMessageFromRunnerToEditor={this.props.sendMessageFromRunnerToEditor}
            />
          )}
        </div>
      </>
    );
  }

  // helpers

  private shouldUpdate(
    oldSolution: ISolution | null | undefined,
    newSolution: ISolution | null | undefined,
  ): boolean {
    // if the newSolution is null, but the old solution wasn't, update
    if (newSolution === null && oldSolution !== null) {
      return true;
    }

    if (newSolution) {
      // if there's a new solution
      // but no old solution, update
      if (!oldSolution) {
        return true;
      }

      // or if it is a different solution
      if (newSolution.id !== oldSolution.id) {
        return true;
      }

      // or if the solution has been updated
      if (newSolution.dateLastModified > oldSolution.dateLastModified) {
        return true;
      }
    }
    // otherwise
    return false;
  }
}

export default Snippet;
