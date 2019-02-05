import React from 'react';
import Clipboard from 'clipboard';
import { invokeGlobalErrorHandler } from '../../utilities/splash.screen';

interface IProps {
  /** A function that will be invoked to get the text. */
  textGetter: () => string;

  /** An optional globally-unique selector (like ".my-special-component").
   * If provided, the selector will be used for finding the DOM element to attach the clipboard to,
   * instead of assuming that it's the child of this component.
   * The globallyUniqueSelector should only be needed in special cases.
   * See more in the comment to the class below.  When it is used, it likely means that
   * the component should be a childless one.
   */
  globallyUniqueSelector?: string;

  /** A function to call on success.  If not provided, it will simply do nothing on success. */
  onSuccess?: () => void;

  /** A function to call on failure.  If not provided, the default global error handler will be used. */
  onError?: (e: Error) => void;
}

interface IState {}

/** A component that can be wrapped around a child component, to make that child
 * automatically have "copy-to-clipboard" functionality.
 *
 * By default, you should be to just wrap a component directly.
 * However, in more complex cases like an overlay menu -- where the child
 *    won't be a direct DOM descendent of this component -- a "globallyUniqueSelector"
 *    (such as ".my-special-component") can be provided instead.
 *    If this option is used, it's up to the caller to make sure that the selector is
 *    truly global and won't be repeated elsewhere by the app.
 */
class CopyableToClipboard extends React.Component<IProps, IState> {
  static defaultProps: Partial<IProps> = {
    onError: invokeGlobalErrorHandler,
    onSuccess: () => {
      /* On success, do nothing. No notification is needed unless explicitly requested. */
    },
  };

  private static nextGlobalId = 0;

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

    this.clipboard.on('success', this.props.onSuccess);
    this.clipboard.on('error', this.props.onError);
  }

  componentWillUnmount() {
    this.clipboard.destroy();
  }

  render() {
    if (this.props.globallyUniqueSelector) {
      return this.props.children || null;
    } else {
      // Wrap it in a div so that this ID is captured
      return <div id={this.idIfAny}>{this.props.children}</div>;
    }
  }
}

export default CopyableToClipboard;
