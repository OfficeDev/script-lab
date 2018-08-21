import React from 'react'
import { MessageBar as FabricMessageBar } from 'office-ui-fabric-react/lib/MessageBar'
import { Link } from 'office-ui-fabric-react/lib/Link'
import { IState as IMessageBarState } from '../../store/messageBar/reducer'

import { connect } from 'react-redux'
import { messageBar } from '../../store/actions'

import './animations.css'

interface IPropsFromRedux {
  messageBarProps: IMessageBarState
}

const mapStateToProps = state => ({
  messageBarProps: state.messageBar,
})

interface IActionsFromRedux {
  dismiss: () => void
}

const mapDispatchToProps = dispatch => ({
  dismiss: () => dispatch(messageBar.dismiss()),
})

interface IMessageBar extends IPropsFromRedux, IActionsFromRedux {}

const MessageBar = ({ messageBarProps, dismiss }: IMessageBar) => (
  <div className={`message-bar ${messageBarProps.isVisible ? 'active' : ''}`}>
    <FabricMessageBar
      dismissButtonAriaLabel="Close"
      messageBarType={messageBarProps.style}
      onDismiss={dismiss}
    >
      {messageBarProps.text}
      {messageBarProps.link && (
        <Link href={messageBarProps.link.url}>{messageBarProps.link.text}</Link>
      )}
    </FabricMessageBar>
  </div>
)

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MessageBar)
