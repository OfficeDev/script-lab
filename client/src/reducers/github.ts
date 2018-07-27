import { github, IGithubAction } from '../actions'
import { getType } from 'typesafe-actions'

const profile = (state = {}, action: IGithubAction) => {
  switch (action.type) {
    case getType(github.login.success):
      return action.payload
    default:
      return state
  }
}

export default profile

// selectors
const getToken = state => state.token
const getProfilePic = state => state.profilePic

export const selectors = {
  getToken,
  getProfilePic,
}
