import { combineReducers } from 'redux'
import { getType } from 'typesafe-actions'

import { customFunctions, ICustomFunctionsAction } from '../actions'

type IMetadataState = ICFVisualSnippetMetadata[]

const metadata = (state: IMetadataState, action) => {
  switch (action.type) {
    case getType(customFunctions.fetchMetadata.success):
      return action.payload

    default:
      return state
  }
}

type ILogsState = ILogData[]

const initialLogs = []
const logs = (state: ILogsState = initialLogs, action: ICustomFunctionsAction) => {
  switch (action.type) {
    case getType(customFunctions.clearLogs):
      return initialLogs

    default:
      return state
  }
}

interface IRunnerState {
  isAlive: boolean
  lastUpdated: number
}

const runner = (state: IRunnerState, action) => {
  switch (action.type) {
    default:
      return state
  }
}

const engineStatus = (state: ICustomFunctionEngineStatus, action) => {
  switch (action.type) {
    default:
      return state
  }
}

export interface IState {
  metadata: IMetadataState
  logs: ILogsState
  runner: IRunnerState
  engineStatus: ICustomFunctionEngineStatus
}

export default combineReducers({
  metadata,
  logs,
  runner,
  engineStatus,
})
