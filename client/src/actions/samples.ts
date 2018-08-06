import { createAction, createAsyncAction } from 'typesafe-actions'

export const fetchMetadata = createAsyncAction(
  'FETCH_SAMPLES_METADATA_REQUEST',
  'FETCH_SAMPLES_METADATA_SUCCESS',
  'FETCH_SAMPLES_METADATA_FAILURE',
)<void, ISampleMetadata[], Error>()

export const get = createAction('SAMPLES_GET', resolve => {
  return (rawUrl: string) => resolve(rawUrl)
})
