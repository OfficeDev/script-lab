import { createAction, createAsyncAction } from 'typesafe-actions'

export const open = createAction('EDITOR_OPEN', resolve => {
  return (props: { solutionId: string; fileId: string }) => resolve(props)
})

export const onMount = createAction('EDITOR_ON_MOUNT', resolve => {
  return (editor: monaco.editor.IStandaloneCodeEditor) => resolve(editor)
})

export const onLoadComplete = createAction('EDITOR_ON_LOAD_COMPLETE')

export const applyMonacoOptions = createAction('EDITOR_APPLY_MONACO_OPTIONS')

export const addIntellisenseFiles = createAsyncAction(
  'EDITOR_ADD_INTELLISENSE_FILES_REQUEST',
  'EDITOR_ADD_INTELLISENSE_FILES_SUCCESS',
  'EDITOR_ADD_INTELLISENSE_FILES_FAILURE',
)<{ urls: string[] }, void, Error>()

export const removeIntellisenseFiles = createAsyncAction(
  'EDITOR_REMOVE_INTELLISENSE_FILES_REQUEST',
  'EDITOR_REMOVE_INTELLISENSE_FILES_SUCCESS',
  'EDITOR_REMOVE_INTELLISENSE_FILES_FAILURE',
)<{ urls: string[] }, void, Error>()
