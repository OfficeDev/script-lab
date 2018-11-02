import { combineReducers } from 'redux'
import { github, IGithubAction } from '../actions'
import { getType } from 'typesafe-actions'

type ITokenState = string | null
const token = (state: ITokenState = null, action: IGithubAction): ITokenState => {
  switch (action.type) {
    case getType(github.login.success):
      return action.payload.token
    case getType(github.logout.success):
      return null
    default:
      return state
  }
}

type IProfilePicUrlState = string | null
const profilePicUrl = (
  state: IProfilePicUrlState = null,
  action: IGithubAction,
): IProfilePicUrlState => {
  switch (action.type) {
    case getType(github.login.success):
      return action.payload.profilePicUrl
    case getType(github.logout.success):
      return null
    default:
      return state
  }
}

type IIsLoggingInOrOutState = boolean
const isLoggingInOrOut = (
  state: IIsLoggingInOrOutState = false,
  action: IGithubAction,
): IIsLoggingInOrOutState => {
  switch (action.type) {
    case getType(github.login.request):
    case getType(github.logout.request):
      return true
    case getType(github.login.success):
    case getType(github.login.failure):
    case getType(github.logout.success):
    case getType(github.logout.failure):
      return false
    default:
      return state
  }
}

export interface IState {
  token: ITokenState
  profilePicUrl: IProfilePicUrlState
  isLoggingInOrOut: IIsLoggingInOrOutState
}

export default combineReducers({ token, profilePicUrl, isLoggingInOrOut })
