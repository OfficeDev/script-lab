import { createAsyncAction } from 'typesafe-actions'

export const get = createAsyncAction(
  'GET_GIST_REQUEST',
  'GET_GIST_SUCCESS',
  'GET_GIST_FAILURE',
)<{ gistId?: string; gist?: string }, { solution: ISolution; files: IFile[] }, Error>()

export const create = createAsyncAction(
  'CREATE_GIST_REQUEST',
  'CREATE_GIST_SUCCESS',
  'CREATE_GIST_FAILURE',
)<void, void, Error>()

export const update = createAsyncAction(
  'UPDATE_GIST_REQUEST',
  'UPDATE_GIST_SUCCESS',
  'UPDATE_GIST_FAILURE',
)<void, void, Error>()
