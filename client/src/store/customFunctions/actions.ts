import { createAction, createAsyncAction } from 'typesafe-actions'

interface IMetadata {
  visual: ICFVisualMetadata
  code: string
}

export const fetchMetadata = createAsyncAction(
  'CUSTOM_FUNCTIONS_FETCH_METADATA_REQUEST',
  'CUSTOM_FUNCTIONS_FETCH_METADATA_SUCCESS',
  'CUSTOM_FUNCTIONS_FETCH_METADATA_FAILURE',
)<void, IMetadata, Error>()

export const registerMetadata = createAsyncAction(
  'CUSTOM_FUNCTIONS_REGISTER_METADATA_REQUEST',
  'CUSTOM_FUNCTIONS_REGISTER_METADATA_SUCCESS',
  'CUSTOM_FUNCTIONS_REGISTER_METADATA_FAILURE',
)<IMetadata, void, Error>()
