// general 3rd party
import Clipboard from 'clipboard';
import YAML from 'js-yaml';

// general 1st party
import { convertSolutionToSnippet } from '../../../../../utils';

// React
import React, { Component } from 'react';

// office-ui-fabric-react
import { MessageBarType } from 'office-ui-fabric-react/lib/components/MessageBar';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import { PersonaSize, PersonaCoin } from 'office-ui-fabric-react/lib/Persona';

// common
import CommonHeader from 'common/lib/components/Header';
import { ThemeContext } from 'common/lib/components/Theme';

// local
import SolutionSettings from './SolutionSettings';

// redux
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { IState as IReduxState } from '../../../store/reducer';
import { actions, selectors } from '../../../store';
import { IHeaderItem } from '../../../store/header/selectors';
import BrowserAuthDialog from './BrowserAuthDialog';

export const convertActionCreatorToOnClick = (
  item: IHeaderItem,
  dispatch: any, // TODO: why is this complaining about being a Dispatch?
): IHeaderItem => ({
  ...item,
  onClick: item.actionCreator ? () => dispatch(item.actionCreator()) : undefined,

  subMenuProps: item.subMenuProps
    ? {
        ...item.subMenuProps,
        items:
          item.subMenuProps.items !== undefined
            ? item.subMenuProps.items.map(subItem => ({
                ...subItem,
                onClick: subItem.actionCreator
                  ? () => dispatch(subItem.actionCreator())
                  : undefined,
              }))
            : undefined,
      }
    : undefined,
});

interface IProps {
  items: IHeaderItem[];
  farItems: IHeaderItem[];
  dispatch: Dispatch;

  activeSolution: ISolution;
  notifyClipboardCopySuccess();
  notifyClipboardCopyFailure();

  isLoggingInOrOut: boolean;
  profilePicUrl?: string;
}

interface IState {
  isSolutionSettingsVisible?: boolean;
  isBrowserAuthDialogVisible?: boolean;
}

class Header extends Component<IProps, IState> {
  clipboard: Clipboard;
  state: IState = {};

  constructor(props: IProps) {
    super(props);
    this.clipboard = new Clipboard('.export-snippet-to-clipboard', {
      text: this.getSnippetYAML,
    });
    this.clipboard.on('success', props.notifyClipboardCopySuccess);
    this.clipboard.on('error', props.notifyClipboardCopyFailure);
  }

  componentWillUnmount() {
    this.clipboard.destroy();
  }

  getSnippetYAML = () =>
    YAML.safeDump(convertSolutionToSnippet(this.props.activeSolution));

  showSolutionSettings = () => this.setState({ isSolutionSettingsVisible: true });
  hideSolutionSettings = () => this.setState({ isSolutionSettingsVisible: false });
  showBrowserAuthDialog = () => this.setState({ isBrowserAuthDialogVisible: true });
  hideBrowserAuthDialog = () => this.setState({ isBrowserAuthDialogVisible: false });

  private renderItem = (item: IHeaderItem): IHeaderItem => {
    const customRenderIcons = this.getCustomOnRenderIconButtons();
    const onClickReadyItem = convertActionCreatorToOnClick(item, this.props.dispatch);
    if (item.key in customRenderIcons) {
      return {
        ...onClickReadyItem,
        onRenderIcon: customRenderIcons[item.key],
      };
    } else {
      return onClickReadyItem;
    }
  };

  private getCustomOnRenderIconButtons = (): { [key: string]: () => JSX.Element } => {
    const { isLoggingInOrOut, profilePicUrl } = this.props;

    return {
      account: () => (
        <div style={{ width: '28px', overflow: 'hidden' }}>
          {isLoggingInOrOut ? (
            <Spinner size={SpinnerSize.medium} />
          ) : (
            <ThemeContext.Consumer>
              {theme => (
                <PersonaCoin
                  imageUrl={profilePicUrl}
                  size={PersonaSize.size28}
                  initialsColor="white"
                  styles={{
                    initials: {
                      color: (theme && theme.primary) || 'black',
                    },
                  }}
                />
              )}
            </ThemeContext.Consumer>
          )}
        </div>
      ),
    };
  };

  render() {
    const { items, farItems } = this.props;

    return (
      <>
        <CommonHeader
          items={items.map((item: IHeaderItem) => {
            const renderedItem = this.renderItem(item);
            if (item.key === 'solution-name') {
              return {
                ...renderedItem,
                onClick: this.showSolutionSettings,
              };
            } else {
              return renderedItem;
            }
          })}
          farItems={farItems.map((item: IHeaderItem) => {
            const renderedItem = this.renderItem(item);
            // FIXME minor cleanup
            if (item.key === 'account') {
              return {
                ...renderedItem,
                onClick: this.showBrowserAuthDialog,
              };
            } else {
              return renderedItem;
            }
          })}
        />
        <SolutionSettings
          isOpen={this.state.isSolutionSettingsVisible}
          closeSolutionSettings={this.hideSolutionSettings}
        />
        <BrowserAuthDialog
          isOpen={this.state.isBrowserAuthDialogVisible}
          hide={this.hideBrowserAuthDialog}
        />
      </>
    );
  }
}

export default connect(
  (state: IReduxState) => ({
    items: selectors.header.getItems(state),
    farItems: selectors.header.getFarItems(state),
    activeSolution: selectors.editor.getActiveSolution(state),
    isLoggingInOrOut: selectors.github.getIsLoggingInOrOut(state),
    profilePicUrl: selectors.github.getProfilePicUrl(state) || undefined,
  }),
  (dispatch: Dispatch) => ({
    dispatch,
    notifyClipboardCopySuccess: () =>
      dispatch(actions.messageBar.show({ text: 'Snippet copied to clipboard.' })),
    notifyClipboardCopyFailure: () =>
      dispatch(
        actions.messageBar.show({
          text: 'Snippet failed to copy to clipboard.',
          style: MessageBarType.error,
        }),
      ),
  }),
)(Header);
