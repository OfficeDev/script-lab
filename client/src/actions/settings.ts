import { createAction, createAsyncAction } from 'typesafe-actions'

export const edit = createAsyncAction(
  'SETTINGS_EDIT_REQUEST_NOT_USED',
  'SETTINGS_EDIT_SUCCESS',
  'SETTINGS_EDIT_FAILURE',
)<void, { settings: ISettings }, Error>()
