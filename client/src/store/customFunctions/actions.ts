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
  'REGISTER_METADATA_REQUEST_CUSTOM_FUNCTIONS',
  'CUSTOM_FUNCTIONS_REGISTER_METADATA_SUCCESS',
  'CUSTOM_FUNCTIONS_REGISTER_METADATA_FAILURE',
)<IMetadata, void, Error>()

export const clearLogs = createAction('CUSTOM_FUNCTIONS_CLEAR_LOGS')
