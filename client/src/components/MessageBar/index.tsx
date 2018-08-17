import React from 'react'
import { MessageBar } from 'office-ui-fabric-react/lib/MessageBar'
import { Link } from 'office-ui-fabric-react/lib/Link'
import { IMessageBarState } from '../../reducers/messageBar'
interface IMessageBar {
  messageBarProps: IMessageBarState
  dismiss: () => void
}
export default ({ messageBarProps, dismiss }: IMessageBar) =>
  messageBarProps.isVisible ? (
    <MessageBar
      dismissButtonAriaLabel="Close"
      messageBarType={messageBarProps.style}
      onDismiss={dismiss}
    >
      {messageBarProps.text}
      {messageBarProps.link && (
        <Link href={messageBarProps.link.url}>{messageBarProps.link.text}</Link>
      )}
    </MessageBar>
  ) : null
