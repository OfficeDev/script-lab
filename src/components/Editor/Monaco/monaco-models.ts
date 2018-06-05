import { ISnippet, ISnippetField } from '../../../interfaces'

interface ICachedModel {
  model: monaco.editor.ITextModel
  cursorPos?: monaco.IPosition
}

const cache = {}

export function createAllModelsForSnippet(monaco: any, snippet: ISnippet) {
  Object.keys(snippet.fields)
    .map(k => snippet.fields[k])
    .map(field => createModel(monaco, snippet.id, field))
}

export function createModel(
  monaco: any,
  snippetId: string,
  field: ISnippetField,
): ICachedModel {
  const { metadata, value } = field
  const modelId = getModelId(snippetId, field)
  const uri = new monaco.Uri().with({
    scheme: 'file',
    path: modelId,
  })
  const model = monaco.editor.createModel(
    value,
    metadata.language.toLowerCase(),
    uri,
  )
  cache[modelId] = { model }

  return cache[modelId]
}

export function getModel(
  monaco: any,
  snippetId: string,
  field: ISnippetField,
): ICachedModel {
  const id = getModelId(snippetId, field)

  if (cache[id]) {
    return cache[id]
  } else {
    return createModel(monaco, snippetId, field)
  }
}

function getModelId(snippetId: string, field: ISnippetField) {
  return `${snippetId}/index.${field.metadata.language}`
}
