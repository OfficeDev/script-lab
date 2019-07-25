import React from 'react';

interface IProps {
  content: string;
  lastRendered: number;
  onRenderComplete?: () => void;
  namespacesToTransferFromWindow: string[];
}

interface IState {
  previousRenderTimestamp: number;
}

class IFrame extends React.Component<IProps, IState> {
  node: HTMLIFrameElement;
  private isIframeMounted: boolean;

  constructor(props: IProps) {
    super(props);
    this.isIframeMounted = false;

    this.state = { previousRenderTimestamp: 0 };

    // Set up a callback so that after writing the snippet to the iframe, the parent is notified.
    // This allows us to redirect onerror and console (which would otherwise get overwritten when
    // writing to the iframe document, if we did it ahead of time).
    // This is also where we put the "Office", "Excel", and etc namespaces onto the iframe
    // (which get lost in IE if we do it preemptively.)
    // Essentially, the only reliable way seems to be to monkeypatch the frame
    // *once the script thinks it's ready, via it calling back into us*.
    (window as any).scriptRunnerOnLoad = (iframeWindow: Window) => {
      this.monkeypatchIframe(iframeWindow);

      this.setState({ previousRenderTimestamp: this.props.lastRendered });
      if (this.props.onRenderComplete) {
        this.props.onRenderComplete();
      }
    };
  }

  componentDidMount() {
    this.isIframeMounted = true;

    const doc = this.getContentDoc();
    if (doc && doc.readyState === 'complete') {
      this.forceUpdate();
    } else {
      this.node.addEventListener('load', this.handleLoad);
    }
  }

  shouldComponentUpdate(nextProps: IProps) {
    return this.shouldRender();
  }

  shouldRender = () => this.props.lastRendered !== this.state.previousRenderTimestamp;

  componentWillUnmount() {
    this.isIframeMounted = false;

    this.node.removeEventListener('load', this.handleLoad);
  }

  getContentDoc = () => this.node.contentDocument;

  renderContents = () => {
    if (this.isIframeMounted && this.shouldRender()) {
      // writing content to iframe
      const doc = this.getContentDoc();
      doc.open('text/html', 'replace');
      doc.write(this.props.content);
      doc.close();
    }
  };

  handleLoad = () => {
    if (this.isIframeMounted) {
      this.forceUpdate();
    }
  };

  render() {
    this.renderContents();
    return (
      <iframe
        id="user-snippet"
        ref={node => (this.node = node)}
        style={{
          width: '100%',
          height: '100%',
          margin: 0,
          border: 0,
        }}
      />
    );
  }

  private monkeypatchIframe = (iframe: Window) => {
    // cast to "as any" so that can overwrite the console field, which TS thinks is read-only
    (iframe as any).console = window.console;
    iframe.onerror = (...args) => console.error(args);

    this.props.namespacesToTransferFromWindow.forEach(
      namespace => (iframe[namespace] = window[namespace]),
    );
  };
}

export default IFrame;
