import React from 'react';
import Clipboard from 'clipboard';
import { invokeGlobalErrorHandler } from '../../utilities/splash.screen';

interface IProps {
  textGetter: () => string;
  globallyUniqueSelector?: string;
  onSuccess?: () => void;
  onError?: () => void;
}

interface IState {}

class CopyableToClipboard extends React.Component<IProps, IState> {
  private idIfAny: string;
  private clipboard: Clipboard;

  constructor(props: IProps) {
    super(props);

    if (!this.props.globallyUniqueSelector) {
      this.idIfAny = 'export-to-clipboard-' + CopyableToClipboard.nextGlobalId++;
    }
  }

  componentDidMount() {
    const selector = this.props.globallyUniqueSelector || `#${this.idIfAny} > *`;
    this.clipboard = new Clipboard(selector, {
      text: this.props.textGetter,
    });

    if (this.props.onSuccess) {
      this.clipboard.on('success', this.props.onSuccess);
    }

    this.clipboard.on(
      'error',
      this.props.onError ? this.props.onError : invokeGlobalErrorHandler,
    );
  }

  componentWillUnmount() {
    this.clipboard.destroy();
  }

  render() {
    if (this.props.globallyUniqueSelector) {
      return this.props.children;
    } else {
      // Wrap it in a div so that this ID is captured
      return <div id={this.idIfAny}>{this.props.children}</div>;
    }
  }

  private static nextGlobalId = 0;
}

export default CopyableToClipboard;
