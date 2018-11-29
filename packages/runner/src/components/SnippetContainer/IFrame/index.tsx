import React from 'react';

interface IProps {
  content: string;
  lastRendered: number;
  onRenderComplete?: () => void;
  namespacesToTransferFromWindow: string[];
}

interface IState {
  previousRender: number;
}

class IFrame extends React.Component<IProps, IState> {
  node; // ref to iframe node
  // tslint:disable-next-line:variable-name
  _isMounted: boolean;

  constructor(props) {
    super(props);
    this._isMounted = false;

    this.state = { previousRender: 0 };
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

  shouldComponentUpdate(nextProps: IProps) {
    return this.shouldRender();
  }

  shouldRender = () => this.props.lastRendered !== this.state.previousRender;

  componentWillUnmount() {
    this._isMounted = false;

    this.node.removeEventListener('load', this.handleLoad);
  }

  getContentDoc = () => this.node.contentDocument;

  renderContents = () => {
    if (this._isMounted && this.shouldRender()) {
      // setting up iframe
      const iframe = this.node.contentWindow;

      iframe.console = window.console;
      iframe.onerror = (...args) => console.error(args);

      this.props.namespacesToTransferFromWindow.forEach(
        namespace => (iframe[namespace] = window[namespace]),
      );

      // writing content to iframe
      const doc = this.getContentDoc();
      doc.location.reload();
      doc.open('text/html', 'replace');
      doc.write(this.props.content);
      doc.close();

      this.setState({ previousRender: this.props.lastRendered });
      if (this.props.onRenderComplete) {
        this.props.onRenderComplete();
      }
    }
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
        style={{
          width: '100%',
          height: '100%',
          margin: 0,
          border: 0,
        }}
      />
    );
  }
}

export default IFrame;
