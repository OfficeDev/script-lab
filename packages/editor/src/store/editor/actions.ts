import { createAction, createAsyncAction } from 'typesafe-actions'

export const open = createAction('EDITOR_OPEN', resolve => {
  return (props: { solutionId: string; fileId: string }) => resolve(props)
})

export const signalHasLoaded = createAction('EDITOR_HAS_LOADED')
