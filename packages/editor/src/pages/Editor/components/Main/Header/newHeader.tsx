import React, { Component } from 'react';
import { connect } from 'react-redux';
import Clipboard from 'clipboard';

import { convertSolutionToSnippet } from '../../../../../utils';
import YAML from 'js-yaml';
import CommonHeader, { IProps as ICommonHeaderProps } from 'common/lib/components/Header';
import { IState as IReduxState } from '../../../store/reducer';
import { actions, selectors } from '../../../store';
import { IHeaderItem } from '../../../store/header/selectors';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import { PersonaSize, PersonaCoin } from 'office-ui-fabric-react/lib/Persona';
import { ThemeContext } from 'common/lib/components/Theme';
import { MessageBarType } from 'office-ui-fabric-react/lib/components/MessageBar';

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

class Header extends Component<IProps> {
  clipboard: Clipboard;

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

  render() {
    const { items, farItems, dispatch, isLoggingInOrOut, profilePicUrl } = this.props;

    return (
      <CommonHeader
        items={items.map((item: IHeaderItem) => {
          return {
            ...item,
            onClick: item.actionCreator
              ? () => {
                  console.log(item.actionCreator);
                  dispatch(item.actionCreator());
                }
              : undefined,
          };
        })}
        farItems={farItems.map((item: IHeaderItem) => {
          if (item.key === 'account') {
            return {
              ...item,
              onClick: item.actionCreator
                ? () => dispatch(item.actionCreator())
                : undefined,
              onRenderIcon: () => (
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
          } else {
            return item;
          }
        })}
      />
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
