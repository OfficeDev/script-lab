import { combineReducers } from 'redux'
import { getType } from 'typesafe-actions'
import { defaultRun, IDefaultRunAction } from '../actions'

interface IMetadataForActiveState {
  [funcName: string]: IDefaultFunctionRunMetadata
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
  action: IDefaultRunAction,
) => {
  switch (action.type) {
    case getType(defaultRun.updateActiveSolutionMetadata):
      return action.payload.reduce((acc, item) => ({ ...acc, [item.name]: item }), {})

    case getType(defaultRun.runFunction.request):
      return setStatus(state, action, 'Running')

    case getType(defaultRun.runFunction.success):
      return setStatus(state, action, 'Success')

    case getType(defaultRun.runFunction.failure):
      return setStatus(state, action, 'Failure')

    default:
      return state
  }
}

type IMetadataState = IDefaultSnippetRunMetadata[]

const metadata = (state: IMetadataState = [], action: IDefaultRunAction) => {
  switch (action.type) {
    case getType(defaultRun.fetchMetadata.success):
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
