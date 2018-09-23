import React from 'react'
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button'

import {
  MessageBar as FabricMessageBar,
  MessageBarType,
} from 'office-ui-fabric-react/lib/MessageBar'

import './animations.css'

export interface IProps {
  isVisible: boolean
  message: string
  accept: () => void
  acceptMessage: string
  dismiss: () => void
}

const MessageBar = ({ isVisible, message, accept, acceptMessage, dismiss }: IProps) => (
  <div className={`message-bar ${isVisible ? 'active' : ''}`}>
    <FabricMessageBar
      dismissButtonAriaLabel="Close"
      messageBarType={MessageBarType.info}
      isMultiline={false}
      actions={
        <div>
          <PrimaryButton onClick={accept} text={acceptMessage} />
        </div>
      }
      onDismiss={dismiss}
    >
      {message}
    </FabricMessageBar>
  </div>
)

export default MessageBar
