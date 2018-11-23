import React from 'react';
// import inlineScript from './templates/inlineScript';
// import 'handlebars/lib/handlebars.runtime';
// import './templates/compiled/newsnippet.handlebars';
import ts from 'typescript';
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

class Snippet extends React.Component<IProps> {
  node; // ref to iframe node
  // tslint:disable-next-line:variable-name
  _isMounted: boolean;

  constructor(props) {
    super(props);
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;

    const doc = this.getContentDoc();
    if (doc && doc.readyState === 'complete') {
      this.forceUpdate();
    } else {
      this.node.addEventListener('load', this.handleLoad);
    }
  }

  shouldComponentUpdate(nextProps: IProps, nextState) {
    return (
      nextProps.solution.id !== this.props.solution.id ||
      nextProps.solution.dateLastModified !== this.props.solution.dateLastModified
    );
  }

  componentWillUnmount() {
    this._isMounted = false;

    this.node.removeEventListener('load', this.handleLoad);
  }

  getContentDoc = () => this.node.contentDocument;

  renderContents = () => {
    if (this._isMounted) {
      this.setupIframe();
      const { solution } = this.props;

      // gathering content out of solution
      const html = solution.files.find(file => file.name === 'index.html')!.content;
      const inlineStyles = solution.files.find(file => file.name === 'index.css')!
        .content;
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
      const libraries = solution.files.find(file => file.name === 'libraries.txt')!
        .content;
      const { linkReferences, scriptReferences, officeJS } = processLibraries(
        libraries,
        false,
      );

      const content = template({
        linkReferences,
        scriptReferences,
        inlineScript,
        inlineStyles,
        html,
      });

      // console.log({ resultFromHandlebars });
      const doc = this.getContentDoc();
      doc.open('text/html', 'replace');
      doc.write(content);
      doc.close();
    }
  };

  setupIframe = () => {
    if (!this._isMounted) {
      return;
    }

    const iframe = this.node.contentWindow;

    // console logs
    iframe.console = window.console;
    iframe.onerror = (...args) => console.error(args);
    // console.log({
    //   iframe,
    //   window,
    //   windowLocation: window.location,
    //   parent: window.parent,
    //   parentLocation: window.parent.location,
    // });
    officeNamespacesForIframe.forEach(
      namespace => (iframe[namespace] = window[namespace]),
    );
  };

  handleLoad = () => {
    if (this._isMounted) {
      this.forceUpdate();
    }
  };

  render() {
    this.renderContents();
    return (
      <iframe
        id="user-snippet"
        ref={node => (this.node = node)}
        style={{ width: '100%', height: '100%', margin: 0, border: 0 }}
      />
    );
  }
}

export default Snippet;
