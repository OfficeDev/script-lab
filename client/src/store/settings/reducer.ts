import { getType } from 'typesafe-actions'
import { defaultSettings } from '../../defaultSettings'
import { settings as settingsActions, ISettingsAction } from '../actions'

export type IState = ISettings

const settings = (state: IState = defaultSettings, action: ISettingsAction) => {
  switch (action.type) {
    case getType(settingsActions.edit.success):
      return action.payload.settings
    default:
      return state
  }
}

export default settings
