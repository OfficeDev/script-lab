import { createAction } from 'typesafe-actions'

export const add = createAction('FILES_ADD', resolve => {
  return (files: IFile[]) => resolve(files)
})

export const edit = createAction('FILE_EDIT', resolve => {
  return (solutionId: string, fileId: string, file: Partial<IEditableFileProperties>) =>
    resolve({ solutionId, fileId, file, timestamp: Date.now() })
})

export const remove = createAction('FILES_REMOVE', resolve => {
  return (ids: string[]) => resolve(ids)
})
