import React from 'react';
// import inlineScript from './templates/inlineScript';
// import 'handlebars/lib/handlebars.runtime';
// import './templates/compiled/newsnippet.handlebars';
import ts from 'typescript';

import IFrame from './IFrame';

import template from './template';
import { officeNamespacesForIframe } from '../../constants';

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

interface IProps {
  solution: ISolution;
}

interface IState {
  isLoading: boolean;
  content: string;
  lastRendered: number;
}

class Snippet extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);

    this.state = {
      content: this.getContent(this.props),
      lastRendered: Date.now(),
      isLoading: true,
    };
  }

  componentDidMount() {}

  componentDidUpdate(prevProps: IProps) {
    if (
      this.props.solution.id !== prevProps.solution.id ||
      this.props.solution.dateLastModified !== prevProps.solution.dateLastModified
    ) {
      this.setState({
        content: this.getContent(this.props),
        lastRendered: Date.now(),
        isLoading: true,
      });
    }
  }

  completeLoad = () => this.setState({ isLoading: false });

  // shouldComponentUpdate(nextProps: IProps, nextState: IState) {
  //   // console.log('componentShouldupdate');
  //   return (
  //     nextProps.solution.id !== this.props.solution.id ||
  //     nextProps.solution.dateLastModified !== this.props.solution.dateLastModified ||
  //     nextState.lastRendered !== this.state.lastRendered
  //   );
  // }

  componentWillUnmount() {}

  getContent = ({ solution }: IProps) => {
    // gathering content out of solution
    const html = solution.files.find(file => file.name === 'index.html')!.content;
    const inlineStyles = solution.files.find(file => file.name === 'index.css')!.content;
    const inlineScript = ts.transpileModule(
      solution.files.find(file => file.name === 'index.ts')!.content,
      {
        reportDiagnostics: true,
        compilerOptions: {
          target: ts.ScriptTarget.ES5,
          allowJs: true,
          lib: ['dom', 'es2015'],
        },
      },
    ).outputText;
    const libraries = solution.files.find(file => file.name === 'libraries.txt')!.content;
    const { linkReferences, scriptReferences, officeJS } = processLibraries(
      libraries,
      false,
    );

    return template({
      linkReferences,
      scriptReferences,
      inlineScript,
      inlineStyles,
      html,
    });
  };

  render() {
    return (
      <IFrame
        content={this.state.content}
        lastRendered={this.state.lastRendered}
        onRenderComplete={this.completeLoad}
        namespacesToTransferFromWindow={officeNamespacesForIframe}
      />
    );
  }
}

export default Snippet;
