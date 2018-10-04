import React from 'react'
import { MessageBar as FabricMessageBar } from 'office-ui-fabric-react/lib/MessageBar'
import { Link } from 'office-ui-fabric-react/lib/Link'
import { IState as IMessageBarState } from '../../../store/messageBar/reducer'

import { connect } from 'react-redux'
import { messageBar } from '../../../store/actions'
import { getMessageBarStyle } from './helpers'

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

export interface IProps extends IPropsFromRedux, IActionsFromRedux {}

export const MessageBar = ({ messageBarProps, dismiss }: IProps) => (
  <div className={`message-bar ${messageBarProps.isVisible ? 'active' : ''}`}>
    <FabricMessageBar
      dismissButtonAriaLabel="Close"
      messageBarType={messageBarProps.style}
      onDismiss={dismiss}
      styles={getMessageBarStyle(messageBarProps.style)}
    >
      {messageBarProps.text}
      {messageBarProps.link && (
        <Link href={messageBarProps.link.url} target="_blank">
          {messageBarProps.link.text}
        </Link>
      )}
    </FabricMessageBar>
  </div>
)

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MessageBar)
