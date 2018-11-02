import { combineReducers } from 'redux'
import { getType } from 'typesafe-actions'
import { directScriptExecution, IDirectScriptExecutionAction } from '../actions'

interface IMetadataForActiveState {
  [funcName: string]: IDirectScriptExecutionFunctionMetadata
}

const setStatus = (state: IMetadataForActiveState, action, status) => ({
  ...state,
  [action.payload.functionName]: {
    ...state[action.payload.functionName],
    status,
  },
})

const metadataForActiveSolution = (
  state: IMetadataForActiveState = {},
  action: IDirectScriptExecutionAction,
) => {
  switch (action.type) {
    case getType(directScriptExecution.updateActiveSolutionMetadata):
      return action.payload.reduce((acc, item) => ({ ...acc, [item.name]: item }), {})

    case getType(directScriptExecution.runFunction.request):
      return setStatus(state, action, 'Running')

    case getType(directScriptExecution.runFunction.success):
      if (state[action.payload.functionName].status === 'Running') {
        return setStatus(state, action, 'Success')
      } else {
        return state
      }

    case getType(directScriptExecution.runFunction.failure):
      if (state[action.payload.functionName].status === 'Running') {
        return setStatus(state, action, 'Success')
      } else {
        return state
      }

    case getType(directScriptExecution.terminateAll.success):
      return Object.keys(state)
        .map(funcName => ({ ...state[funcName], status: 'Idle' }))
        .reduce((acc, item) => ({ ...acc, [item.name]: item }), {})

    default:
      return state
  }
}

type IMetadataState = IDefaultSnippetRunMetadata[]

const metadata = (state: IMetadataState = [], action: IDirectScriptExecutionAction) => {
  switch (action.type) {
    case getType(directScriptExecution.fetchMetadata.success):
      return action.payload

    default:
      return state
  }
}

export interface IState {
  metadataForActiveSolution: IMetadataForActiveState
  metadata: IMetadataState
}

export default combineReducers({
  metadataForActiveSolution,
  metadata,
})
