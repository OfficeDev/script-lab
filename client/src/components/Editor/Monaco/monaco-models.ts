interface ICachedModel {
  model: monaco.editor.ITextModel
  cursorPos?: monaco.IPosition
}

const cache = {}

export function createModel(monaco: any, file: IFile): ICachedModel {
  // TODO: move language to a computed property of each file
  const { language, content, id } = file
  const uri = new monaco.Uri().with({
    scheme: 'file',
    path: id,
  })
  const model = monaco.editor.createModel(content, language.toLowerCase(), uri)
  cache[id] = { model }
  return cache[id]
}

export function getModel(monaco: any, file: IFile) {
  const id = file.id

  if (cache[id]) {
    return cache[id]
  } else {
    return createModel(monaco, file)
  }
}

export function setPosForModel(fileId: string, pos: monaco.IPosition) {
  if (cache[fileId]) {
    cache[fileId].cursorPos = pos
  }
}
