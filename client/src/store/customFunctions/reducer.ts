import { combineReducers } from 'redux'
import { getType } from 'typesafe-actions'

import { customFunctions, ICustomFunctionsAction } from '../actions'

type IMetadataState = ICFVisualSnippetMetadata[]

const metadata = (state: IMetadataState = [], action) => {
  switch (action.type) {
    case getType(customFunctions.fetchMetadata.success):
      console.log('metadata fetch success')
      console.log(action.payload)
      return action.payload

    default:
      return state
  }
}

type ILogsState = ILogData[]

const initialLogs = []
const logs = (state: ILogsState = initialLogs, action: ICustomFunctionsAction) => {
  switch (action.type) {
    case getType(customFunctions.pushLogs):
      return [...state, ...action.payload]

    case getType(customFunctions.clearLogs):
      return initialLogs

    default:
      return state
  }
}

const runner = (
  state: IRunnerState = { isAlive: false, lastUpdated: 0 },
  action: ICustomFunctionsAction,
) => {
  switch (action.type) {
    case getType(customFunctions.updateRunner):
      return action.payload

    default:
      return state
  }
}

const engineStatus = (
  state: ICustomFunctionEngineStatus = { enabled: false },
  action: ICustomFunctionsAction,
) => {
  switch (action.type) {
    case getType(customFunctions.updateEngineStatus):
      return action.payload

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
