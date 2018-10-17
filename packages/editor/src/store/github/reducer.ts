import { github, IGithubAction } from '../actions'
import { getType } from 'typesafe-actions'

export interface IState {
  token?: string
  profilePicUrl?: string
}

const profile = (state: IState = {}, action: IGithubAction): IState => {
  switch (action.type) {
    case getType(github.login.success):
      return action.payload
    case getType(github.logout.success):
      return {}
    default:
      return state
  }
}

export default profile
