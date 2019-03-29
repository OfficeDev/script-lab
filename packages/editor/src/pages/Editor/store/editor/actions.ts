import { createAction, createAsyncAction } from 'typesafe-actions';
import { History } from 'history';

export const open = createAction('EDITOR_OPEN');
export const hide = createAction('EDITOR_HIDE');

export const openBackstage = createAction('BACKSTAGE_OPEN');
export const hideBackstage = createAction('BACKSTAGE_HIDE');

export const openFile = createAction('EDITOR_OPEN_FILE', resolve => {
  return (props: { solutionId?: string; fileId: string }) => resolve(props);
});

export const setActive = createAction('EDITOR_SET_ACTIVE', resolve => {
  return (props: { solutionId: string; fileId: string }) => resolve(props);
});

export const onMount = createAction('EDITOR_ON_MOUNT', resolve => {
  return (editor: monaco.editor.IStandaloneCodeEditor) => resolve(editor);
});

export const applyMonacoOptions = createAction('EDITOR_APPLY_MONACO_OPTIONS');

export const setIntellisenseFiles = createAsyncAction(
  'EDITOR_SET_INTELLISENSE_FILES_REQUEST',
  'EDITOR_SET_INTELLISENSE_FILES_SUCCESS',
  'EDITOR_SET_INTELLISENSE_FILES_FAILURE',
)<{ urls: string[] }, { [url: string]: monaco.IDisposable }, Error>();

export const removeIntellisenseFiles = createAction(
  'EDITOR_REMOVE_INTELLISENSE_FILES',
  resolve => {
    return (urls: string[]) => resolve(urls);
  },
);

export const applyFormatting = createAction('APPLY_FORMATTING');

export const newSolutionOpened = createAction('NEW_SOLUTION_OPENED', resolve => {
  return (solution: ISolution) => resolve(solution);
});
export const newFileOpened = createAction('NEW_FILE_OPENED', resolve => {
  return (solution: ISolution, file: IFile) => resolve({ solution, file });
});

export const navigateToRun = createAction('NAVIGATE_TO_RUN', resolve => {
  return () => resolve(null, { telemetry: { eventName: 'Editor.NavigatedToRun' } });
});

export const shouldUpdateIntellisense = createAction('EDITOR_SHOULD_UPDATE_INTELLISENSE');
