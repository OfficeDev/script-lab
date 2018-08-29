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

export const pushLogs = createAction('CUSTOM_FUNCTIONS_PUSH_LOGS', resolve => {
  return (logs: ILogData[]) => resolve(logs)
})

export const updateRunner = createAction('CUSTOM_FUNCTIONS_UPDATE_RUNNER', resolve => {
  return (props: IRunnerState) => resolve(props)
})

export const updateEngineStatus = createAction(
  'CUSTOM_FUNCTIONS_UPDATE_ENGINE_STATUS',
  resolve => {
    return (props: ICustomFunctionEngineStatus) => resolve(props)
  },
)

export const clearLogs = createAction('CUSTOM_FUNCTIONS_CLEAR_LOGS')

export const fetchLogsAndHeartbeat = createAction(
  'CUSTOM_FUNCTIONS_FETCH_LOGS_AND_HEARTBEAT',
)
