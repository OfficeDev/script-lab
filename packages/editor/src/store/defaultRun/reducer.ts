import { combineReducers } from 'redux'
import { getType } from 'typesafe-actions'
import { defaultRun, IDefaultRunAction } from '../actions'

type IMetadataForActiveState = IDefaultFunctionRunMetadata[]

const metadataForActiveSolution = (
  state: IMetadataForActiveState = [],
  action: IDefaultRunAction,
) => {
  switch (action.type) {
    case getType(defaultRun.updateActiveSolutionMetadata):
      return action.payload

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
