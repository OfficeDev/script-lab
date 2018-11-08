import { createAction } from 'typesafe-actions'
import { DialogType } from 'office-ui-fabric-react/lib/Dialog'

export const show = createAction('DIALOG_SHOW', resolve => {
  return (
    title: string,
    subText: string,
    buttons: Array<{
      text: string
      action: { type: string; payload?: any }
      isPrimary: boolean
    }>,
    style: DialogType = DialogType.largeHeader,
    isBlocking: boolean = false,
  ) => resolve({ title, subText, buttons, style, isBlocking })
})

export const dismiss = createAction('DIALOG_DISMISS')

// private usage for reducer to make it so the dialog disappears nicely then has it's info reset
export const hide = createAction('DIALOG_HIDE')
export const reset = createAction('DIALOG_RESET')
