import { UPDATE_SNIPPET, CHANGE_ACTIVE_FIELD } from './types'

export const updateSnippet = (
  snippetId: string,
  fieldName: string,
  value: string,
) => ({ type: UPDATE_SNIPPET, snippetId, fieldName, value })

export const changeActiveField = (fieldName: string) => ({
  type: CHANGE_ACTIVE_FIELD,
  fieldName,
})
