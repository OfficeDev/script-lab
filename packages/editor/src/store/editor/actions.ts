import { createAction, createAsyncAction } from 'typesafe-actions'

export const open = createAction('EDITOR_OPEN', resolve => {
  return (props: { solutionId: string; fileId: string }) => resolve(props)
})

export const setActive = createAction('EDITOR_SET_ACTIVE', resolve => {
  return (props: { solutionId: string; fileId: string }) => resolve(props)
})

export const onMount = createAction('EDITOR_ON_MOUNT', resolve => {
  return (editor: monaco.editor.IStandaloneCodeEditor) => resolve(editor)
})

export const onLoadComplete = createAction('EDITOR_ON_LOAD_COMPLETE')

export const applyMonacoOptions = createAction('EDITOR_APPLY_MONACO_OPTIONS')

export const setIntellisenseFiles = createAsyncAction(
  'EDITOR_SET_INTELLISENSE_FILES_REQUEST',
  'EDITOR_SET_INTELLISENSE_FILES_SUCCESS',
  'EDITOR_SET_INTELLISENSE_FILES_FAILURE',
)<{ urls: string[] }, { [url: string]: monaco.IDisposable }, Error>()

export const removeIntellisenseFiles = createAction(
  'EDITOR_REMOVE_INTELLISENSE_FILES',
  resolve => {
    return (urls: string[]) => resolve(urls)
  },
)

export const applyFormatting = createAction('APPLY_FORMATTING')

export const newSolutionOpened = createAction('NEW_SOLUTION_OPENED', resolve => {
  return (solutionId: string) => resolve(solutionId)
})
export const newFileOpened = createAction('NEW_FILE_OPENED', resolve => {
  return (solutionId: string, fileId: string) => resolve(solutionId, fileId)
})
