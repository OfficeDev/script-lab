// React
import React, { Component } from 'react';

// office-ui-fabric-react
import { MessageBarType } from 'office-ui-fabric-react/lib/components/MessageBar';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import { PersonaSize, PersonaCoin } from 'office-ui-fabric-react/lib/Persona';

// common
import CommonFooter from 'common/lib/components/Footer';

// redux
import { connect } from 'react-redux'; // Note, avoid the temptation to include '@types/react-redux', it will break compile-time!
import { Dispatch } from 'redux';
import { IState as IReduxState } from '../../../store/reducer';
import { selectors } from '../../../store';
import { IHeaderItem } from '../../../store/header/selectors';

import { convertActionCreatorToOnClick } from '../Header';

interface IProps {
  items: IHeaderItem[];
  farItems: IHeaderItem[];
  dispatch: Dispatch;
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
    items: selectors.footer.getItems(state),
    farItems: selectors.footer.getFarItems(state),
  }),
  (dispatch: Dispatch) => ({
    dispatch,
  }),
)(Footer);
