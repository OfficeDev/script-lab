import {
  createAction,
  createAsyncAction,
} from '../../../../utils/typesafe-telemetry-actions';

export const edit = createAsyncAction(
  'SETTINGS_EDIT_REQUEST_NOT_USED',
  'SETTINGS_EDIT_SUCCESS',
  'SETTINGS_EDIT_FAILURE',
)<void, { userSettings: Partial<ISettings> }, Error>();

export const setLastActive = createAction('SETTINGS_SET_LAST_ACTIVE')<{
  solutionId: string;
  fileId: string;
}>();

export const open = createAction('SETTINGS_OPEN')();
export const close = createAction('SETTINGS_CLOSE')();

export const editFile = createAction('SETTINGS_EDIT')<{ newSettings: string }>({
  getTelemetryData: type => ({ type }),
});

export const cycleEditorTheme = createAction('SETTINGS_CYCLE_EDITOR_THEME')({
  getTelemetryData: type => ({ type }),
});
