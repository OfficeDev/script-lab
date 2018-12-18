// React
import React, { Component } from 'react';

// office-ui-fabric-react
import { MessageBarType } from 'office-ui-fabric-react/lib/components/MessageBar';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import { PersonaSize, PersonaCoin } from 'office-ui-fabric-react/lib/Persona';

// common
import CommonFooter from 'common/lib/components/Footer';
import { ThemeContext } from 'common/lib/components/Theme';

// redux
import { connect } from 'react-redux';
import { IState as IReduxState } from '../../../store/reducer';
import { actions, selectors } from '../../../store';
import { IHeaderItem } from '../../../store/header/selectors';

import { convertActionCreatorToOnClick } from '../Header';

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

class Footer extends Component<IProps> {
  private renderItem = (item: IHeaderItem): IHeaderItem => {
    return convertActionCreatorToOnClick(item, this.props.dispatch);
  };

  render() {
    const { items, farItems } = this.props;

    return (
      <CommonFooter
        items={items.map((item: IHeaderItem) => this.renderItem(item))}
        farItems={farItems.map((item: IHeaderItem) => this.renderItem(item))}
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
)(Footer);
