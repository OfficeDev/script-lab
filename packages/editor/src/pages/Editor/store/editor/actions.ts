import {
  createAction,
  createAsyncAction,
} from '../../../../utils/typesafe-telemetry-actions';

export const open = createAction('EDITOR_OPEN')();
export const hide = createAction('EDITOR_HIDE')();

export const openBackstage = createAction('BACKSTAGE_OPEN')();
export const hideBackstage = createAction('BACKSTAGE_HIDE')();

export const openFile = createAction('EDITOR_OPEN_FILE')<{
  solutionId?: string;
  fileId: string;
}>();

export const setActive = createAction('EDITOR_SET_ACTIVE')<{
  solutionId: string;
  fileId: string;
}>();

export const onMount = createAction('EDITOR_ON_MOUNT')<
  monaco.editor.IStandaloneCodeEditor
>();

export const applyMonacoOptions = createAction('EDITOR_APPLY_MONACO_OPTIONS')();

export const setIntellisenseFiles = createAsyncAction(
  'EDITOR_SET_INTELLISENSE_FILES_REQUEST',
  'EDITOR_SET_INTELLISENSE_FILES_SUCCESS',
  'EDITOR_SET_INTELLISENSE_FILES_FAILURE',
)<{ urls: string[] }, { [url: string]: monaco.IDisposable }, Error>();

export const removeIntellisenseFiles = createAction('EDITOR_REMOVE_INTELLISENSE_FILES')<
  string[]
>();

export const applyFormatting = createAction('APPLY_FORMATTING')();

export const newSolutionOpened = createAction('NEW_SOLUTION_OPENED')<ISolution>();

export const newFileOpened = createAction('NEW_FILE_OPENED')<{
  solution: ISolution;
  file: IFile;
}>();

export const navigateToRun = createAction('NAVIGATE_TO_RUN')({
  getTelemetryData: type => ({ type }),
});

export const shouldUpdateIntellisense = createAction(
  'EDITOR_SHOULD_UPDATE_INTELLISENSE',
)();
