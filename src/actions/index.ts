import { UPDATE_SNIPPET_METADATA, CHANGE_ACTIVE_FILE } from './types'
import { ISnippetMetadata } from '../interfaces'

export const updateSnippetMetadata = (
  snippetId: string,
  metadata: Partial<ISnippetMetadata>,
) => ({ type: UPDATE_SNIPPET_METADATA, snippetId, metadata })

export const changeActiveFile = (fileName: string) => ({
  type: CHANGE_ACTIVE_FILE,
  fileName,
})
