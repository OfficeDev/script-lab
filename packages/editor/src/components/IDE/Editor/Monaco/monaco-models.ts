interface ICachedModel {
  model: monaco.editor.ITextModel
  cursorPos?: monaco.IPosition
}

const cache = {}

interface IModelOptions {
  tabSize: number
}

let globalOptions: Partial<IModelOptions> = {}

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

export function getModelByIdIfExists(monaco: any, fileId: string): ICachedModel | null {
  return cache[fileId]
}

export function getModel(monaco: any, file: IFile) {
  const id = file.id
  const cachedModel = cache[id] || createModel(monaco, file)
  cachedModel.model.updateOptions(globalOptions)

  return cachedModel
}

export function setPosForModel(fileId: string, pos: monaco.IPosition) {
  if (cache[fileId]) {
    cache[fileId].cursorPos = pos
  }
}

export function removeModelFromCache(fileId: string) {
  if (cache[fileId]) {
    cache[fileId].model.dispose()
    delete cache[fileId]
  }
}

export function setOptions(options: IModelOptions) {
  globalOptions = options
}
