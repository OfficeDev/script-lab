import { createAction } from 'typesafe-actions'
import { IEditableFileProperties, IFile } from '../interfaces'

export const add = createAction('FILES_ADD', resolve => {
  return (files: IFile[]) => resolve(files)
})

export const edit = createAction('FILE_EDIT', resolve => {
  return (id: string, file: Partial<IEditableFileProperties>) => resolve({ id, file })
})

export const remove = createAction('FILES_REMOVE', resolve => {
  return (ids: string[]) => resolve(ids)
})
