import {
  UPDATE_SNIPPET_METADATA,
  UPDATE_SNIPPET_FIELD,
  CHANGE_ACTIVE_FIELD,
} from './types'
import { ISnippetMetadata } from '../interfaces'

export const updateSnippetMetadata = (
  snippetId: string,
  metadata: Partial<ISnippetMetadata>,
) => ({ type: UPDATE_SNIPPET_METADATA, snippetId, metadata })

export const updateSnippetField = (
  snippetId: string,
  fieldName: string,
  value: string,
) => ({ type: UPDATE_SNIPPET_FIELD, snippetId, fieldName, value })

export const changeActiveField = (fieldName: string) => ({
  type: CHANGE_ACTIVE_FIELD,
  fieldName,
})
