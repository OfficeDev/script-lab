import { createAction, createAsyncAction } from 'typesafe-actions'

export const fetchMetadata = createAsyncAction(
  'FETCH_SAMPLES_METADATA_REQUEST',
  'FETCH_SAMPLES_METADATA_SUCCESS',
  'FETCH_SAMPLES_METADATA_FAILURE',
)<void, ISampleMetadata[], Error>()

export const get = createAsyncAction(
  'GET_SAMPLE_REQUEST',
  'GET_SAMPLE_SUCCESS',
  'GET_SAMPLE_FAILURE',
)<{ rawUrl: string }, { solution: ISolution; files: IFile[] }, Error>()
