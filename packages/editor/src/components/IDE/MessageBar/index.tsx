import React from 'react';
import { MessageBar as FabricMessageBar } from 'office-ui-fabric-react/lib/MessageBar';
import { Link } from 'office-ui-fabric-react/lib/Link';
import { IState as IMessageBarState } from '../../../store/messageBar/reducer';

import { connect } from 'react-redux';
import { messageBar } from '../../../store/actions';
import { getMessageBarStyle } from './helpers';

import './animations.css';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';

interface IPropsFromRedux {
  messageBarProps: IMessageBarState;
}

const mapStateToProps = state => ({
  messageBarProps: state.messageBar,
});

interface IActionsFromRedux {
  buttonOnClick: () => void;
  dismiss: () => void;
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  buttonOnClick: ownProps.messageBarProps.button
    ? () => dispatch(ownProps.messageBarProps.button.action)
    : () => {},
  dismiss: () => dispatch(messageBar.dismiss()),
});

export interface IProps extends IPropsFromRedux, IActionsFromRedux {}

export const MessageBar = ({ messageBarProps, buttonOnClick, dismiss }: IProps) => (
  <div className={`message-bar ${messageBarProps.isVisible ? 'active' : ''}`}>
    <FabricMessageBar
      dismissButtonAriaLabel="Close"
      messageBarType={messageBarProps.style}
      onDismiss={dismiss}
      styles={getMessageBarStyle(messageBarProps.style)}
      isMultiline={false}
      actions={
        messageBarProps.button ? (
          <div>
            <DefaultButton primary onClick={buttonOnClick}>
              {messageBarProps.button.text}
            </DefaultButton>
          </div>
        ) : (
          undefined
        )
      }
    >
      {messageBarProps.text}
      {messageBarProps.link && (
        <Link href={messageBarProps.link.url} target="_blank">
          {messageBarProps.link.text}
        </Link>
      )}
    </FabricMessageBar>
  </div>
);
/* This is a bit weird, i'll admit... but it is needed.
   Basically what I'm doing is making a wrapper component
   with the first connect that gets the action object I
   want to dispatch and it will be passed to the second wrapper
   (second connect) as a parent passing its prop to a child
   which means I can access this prop in the mapDispatchToProps
   via ownProps and therefore dispatch that action upon clicking
   the button. This allows for the action to dispatch to also
   be set via the MessageBar reducer. */
const mapEmptyToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapEmptyToProps,
)(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(MessageBar),
);
