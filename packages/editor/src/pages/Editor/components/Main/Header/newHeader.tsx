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
import { IState as IReduxState } from '../../../store/reducer';
import { actions, selectors } from '../../../store';
import { IHeaderItem } from '../../../store/header/selectors';

interface IProps {
  items: IHeaderItem[];
  farItems: IHeaderItem[];
  dispatch: (action: { type: string; payload?: any }) => void;

  activeSolution: ISolution;
  notifyClipboardCopySuccess();
  notifyClipboardCopyFailure();

  isLoggingInOrOut: boolean;
  profilePicUrl?: string;
}

interface IState {
  isSolutionSettingsVisible: boolean;
}

class Header extends Component<IProps, IState> {
  clipboard: Clipboard;
  state: IState = { isSolutionSettingsVisible: false };

  constructor(props: IProps) {
    super(props);
    this.clipboard = new Clipboard('.export-to-clipboard', {
      text: this.getSnippetYAML,
    });
    this.clipboard.on('success', props.notifyClipboardCopySuccess);
    this.clipboard.on('error', props.notifyClipboardCopyFailure);
  }

  getSnippetYAML = () =>
    YAML.safeDump(convertSolutionToSnippet(this.props.activeSolution));

  showSolutionSettings = () => this.setState({ isSolutionSettingsVisible: true });
  hideSolutionSettings = () => this.setState({ isSolutionSettingsVisible: false });

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
          farItems={farItems.map((item: IHeaderItem) => this.renderItem(item))}
        />
        <SolutionSettings
          isOpen={this.state.isSolutionSettingsVisible}
          closeSolutionSettings={this.hideSolutionSettings}
        />
      </>
    );
  }

  private renderItem = (item: IHeaderItem): IHeaderItem => {
    const customRenderIcons = this.getCustomOnRenderIconButtons();
    const onClickReadyItem = this.convertActionCreatorToOnClick(item);
    if (item.key in customRenderIcons) {
      return {
        ...onClickReadyItem,
        onRenderIcon: customRenderIcons[item.key],
      };
    } else {
      return onClickReadyItem;
    }
  };

  private convertActionCreatorToOnClick = (item: IHeaderItem): IHeaderItem => ({
    ...item,
    onClick: item.actionCreator
      ? () => {
          console.log(item.actionCreator);
          this.props.dispatch(item.actionCreator());
        }
      : undefined,
  });

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
}

export default connect(
  (state: IReduxState) => ({
    items: selectors.header.getItems(state),
    farItems: selectors.header.getFarItems(state),
    activeSolution: selectors.editor.getActiveSolution(state),
    isLoggingInOrOut: selectors.github.getIsLoggingInOrOut(state),
    profilePicUrl: selectors.github.getProfilePicUrl(state) || undefined,
  }),
  dispatch => ({
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
