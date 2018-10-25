import { createAction } from 'typesafe-actions'

export const open = createAction('EDITOR_OPEN', resolve => {
  return (props: { solutionId: string; fileId: string }) => resolve(props)
})

export const onMount = createAction('EDITOR_ON_MOUNT', resolve => {
  return (editor: monaco.editor.IStandaloneCodeEditor) => resolve(editor)
})

export const onLoadComplete = createAction('EDITOR_ON_LOAD_COMPLETE')

export const applyMonacoOptions = createAction('EDITOR_APPLY_MONACO_OPTIONS')
