import React from 'react';

import IFrame from './IFrame';
import Only from 'common/lib/components/Only';

import runTemplate from './templates/run';
import errorTemplate from './templates/error';

import { officeNamespacesForIframe } from '../../constants';
import { LoadingIndicatorWrapper } from './styles';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import { compileTypeScript, SyntaxError } from './utilities';

function processLibraries(libraries: string, isInsideOffice: boolean) {
  const linkReferences: string[] = [];
  const scriptReferences: string[] = [];
  let officeJS: string | null = null;

  libraries.split('\n').forEach(processLibrary);

  if (!isInsideOffice) {
    officeJS = '<none>';
  }

  return { linkReferences, scriptReferences, officeJS };

  function processLibrary(text: string) {
    if (text == null || text.trim() === '') {
      return null;
    }

    text = text.trim();

    const isNotScriptOrStyle =
      /^#.*|^\/\/.*|^\/\*.*|.*\*\/$.*/im.test(text) ||
      /^@types/.test(text) ||
      /^dt~/.test(text) ||
      /\.d\.ts$/i.test(text);

    if (isNotScriptOrStyle) {
      return null;
    }

    const resolvedUrlPath = /^https?:\/\/|^ftp? :\/\//i.test(text)
      ? text
      : `https://unpkg.com/${text}`;

    if (/\.css$/i.test(resolvedUrlPath)) {
      return linkReferences.push(resolvedUrlPath);
    }

    if (/\.ts$|\.js$/i.test(resolvedUrlPath)) {
      /*
       * Don't add Office.js to the rest of the script references --
       * it is special because of how it needs to be *outside* of the iframe,
       * whereas the rest of the script references need to be inside the iframe.
       */
      if (/(?:office|office.debug).js$/.test(resolvedUrlPath.toLowerCase())) {
        officeJS = resolvedUrlPath;
        return null;
      }

      return scriptReferences.push(resolvedUrlPath);
    }

    return scriptReferences.push(resolvedUrlPath);
  }
}

export interface IProps {
  solution?: ISolution;
  onRender?: (timestamp: number) => void;
}

interface IState {
  isLoading: boolean;
  content: string;
  lastRendered: number;
}

class Snippet extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);

    const lastRendered = Date.now();
    this.state = {
      content: this.getContent(this.props),
      lastRendered,
      isLoading: true,
    };
    if (this.props.onRender) {
      this.props.onRender(lastRendered);
    }
  }

  componentDidMount() {}

  componentDidUpdate(prevProps: IProps) {
    if (
      this.props.solution &&
      ((this.props.solution && !prevProps.solution) ||
        this.props.solution.id !== prevProps.solution!.id ||
        this.props.solution.dateLastModified !== prevProps.solution!.dateLastModified)
    ) {
      const lastRendered = Date.now();
      this.setState({
        content: this.getContent(this.props),
        lastRendered,
        isLoading: true,
      });
      if (this.props.onRender) {
        this.props.onRender(lastRendered);
      }
    }
  }

  completeLoad = () => this.setState({ isLoading: false });

  componentWillUnmount() {}

  getContent = ({ solution }: IProps): string => {
    if (!solution) {
      return '';
    }
    try {
      // gathering content out of solution
      const html = solution.files.find(file => file.name === 'index.html')!.content;
      const inlineStyles = solution.files.find(file => file.name === 'index.css')!
        .content;
      const inlineScript = compileTypeScript(
        solution.files.find(file => file.name === 'index.ts')!.content,
      );
      const libraries = solution.files.find(file => file.name === 'libraries.txt')!
        .content;
      const { linkReferences, scriptReferences, officeJS } = processLibraries(
        libraries,
        false,
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
        title: error instanceof SyntaxError ? 'Syntax Error' : 'Unknown Error',
        details: error.message,
      });
    }
  };

  render() {
    return (
      <>
        <Only when={this.state.isLoading}>
          <LoadingIndicatorWrapper>
            <Spinner size={SpinnerSize.large} label="Loading..." />
          </LoadingIndicatorWrapper>
        </Only>
        {this.props.solution && (
          <div
            style={{ display: this.state.isLoading ? 'none' : 'block', height: '100%' }}
          >
            <IFrame
              content={this.state.content}
              lastRendered={this.state.lastRendered}
              onRenderComplete={this.completeLoad}
              namespacesToTransferFromWindow={officeNamespacesForIframe}
            />
          </div>
        )}
      </>
    );
  }
}

export default Snippet;
