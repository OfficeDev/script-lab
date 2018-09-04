import { combineReducers } from 'redux'
import { getType } from 'typesafe-actions'

import { customFunctions, ICustomFunctionsAction } from '../actions'

type IMetadataState = ICFVisualSnippetMetadata[]

const metadata = (state: IMetadataState = [], action: ICustomFunctionsAction) => {
  switch (action.type) {
    case getType(customFunctions.fetchMetadata.success):
      return action.payload.visual.snippets

    default:
      return state
  }
}

// type ICodeState = string

// const code = (state: ICodeState = '', action: ICustomFunctionsAction) => {
//   switch (action.type) {
//     case getType(customFunctions.fetchMetadata.success):
//       return action.payload.code
//     default:
//       return state
//   }
// }

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
  // code: ICodeState
  logs: ILogsState
  runner: IRunnerState
  engineStatus: ICustomFunctionEngineStatus
}

export default combineReducers({
  metadata,
  // code,
  logs,
  runner,
  engineStatus,
})
