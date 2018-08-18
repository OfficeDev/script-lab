import { createAction } from 'typesafe-actions'
import { MessageBarType } from 'office-ui-fabric-react/lib/MessageBar'

export const show = createAction('MESSAGE_BAR_SHOW', resolve => {
  return (text: string, style: MessageBarType = MessageBarType.info) =>
    resolve({ text, style })
})
export const dismiss = createAction('MESSAGE_BAR_HIDE')
