import { UPDATE_SNIPPET } from './types'

export const updateSnippet = (
  snippetId: string,
  fieldName: string,
  value: string,
) => ({ type: UPDATE_SNIPPET, snippetId, fieldName, value })
