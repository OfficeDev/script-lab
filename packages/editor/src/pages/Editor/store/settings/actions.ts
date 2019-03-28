import { createAction, createAsyncAction } from 'typesafe-actions';

export const edit = createAsyncAction(
  'SETTINGS_EDIT_REQUEST_NOT_USED',
  'SETTINGS_EDIT_SUCCESS',
  'SETTINGS_EDIT_FAILURE',
)<void, { userSettings: Partial<ISettings> }, Error>();

export const setLastActive = createAction('SETTINGS_SET_LAST_ACTIVE', resolve => {
  return (props: { solutionId: string; fileId: string }) => resolve(props);
});

export const open = createAction('SETTINGS_OPEN');
export const close = createAction('SETTINGS_CLOSE');

export const editFile = createAction('SETTINGS_EDIT', resolve => {
  return (props: { newSettings: string }) =>
    resolve(props, { telemetry: { eventName: 'SettingsEdited' } });
});

export const cycleEditorTheme = createAction('SETTINGS_CYCLE_EDITOR_THEME', resolve => {
  return () => resolve(null, { telemetry: { eventName: 'Editor.ThemeChanged' } });
});
