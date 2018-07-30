import { createAsyncAction } from 'typesafe-actions'
import { GistConflictResolutionOptions } from '../interfaces/enums'

// used for import
export const importPublic = createAsyncAction(
  'IMPORT_GIST_REQUEST',
  'IMPORT_GIST_SUCCESS',
  'IMPORT_GIST_FAILURE',
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

export const fetchMetadata = createAsyncAction(
  'FETCH_GIST_METADATA_REQUEST',
  'FETCH_GIST_METADATA_SUCCESS',
  'FETCH_GIST_METADATA_FAILURE',
)<void, Array<{ gistId: string; url: string }>, Error>()

export const get = createAsyncAction(
  'GET_GIST_REQUEST',
  'GET_GIST_SUCCESS',
  'GET_GIST_FAILURE',
)<
  {
    gistId: string
    rawUrl: string
    conflictResolution?: {
      type: GistConflictResolutionOptions
      existingSolution: ISolution
    }
  },
  { solution: ISolution; files: IFile[] },
  Error
>()
