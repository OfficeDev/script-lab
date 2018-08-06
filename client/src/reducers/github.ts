import { combineReducers } from 'redux'
import { github, IGithubAction, gists, IGistsAction } from '../actions'
import { getType } from 'typesafe-actions'

const profile = (state = {}, action: IGithubAction) => {
  switch (action.type) {
    case getType(github.login.success):
      return action.payload
    case getType(github.logout):
      return {}
    default:
      return state
  }
}

const gistMetadata = (state = {}, action: IGistsAction | IGithubAction) => {
  switch (action.type) {
    case getType(gists.fetchMetadata.success):
      return action.payload
    case getType(github.logout):
      return {}
    default:
      return state
  }
}

export default combineReducers({
  profile,
  gistMetadata,
})

// selectors
const getToken = state => state.profile.token
const getProfilePic = state => state.profile.profilePic

const getGistMetadata = (state): ISharedGistMetadata => state.gistMetadata

export const selectors = {
  getToken,
  getProfilePic,
  getGistMetadata,
}
