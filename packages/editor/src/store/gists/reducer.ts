import { getType } from 'typesafe-actions'

import {
  gists as gistActions,
  IGistsAction,
  github as githubActions,
  IGithubAction,
} from '../actions'

export interface IState {
  [id: string]: ISharedGistMetadata
}

const gists = (state: IState = {}, action: IGistsAction | IGithubAction): IState => {
  switch (action.type) {
    case getType(gistActions.fetchMetadata.success):
      return action.payload.reduce((all, gist) => ({ ...all, [gist.id]: gist }), {})
    case getType(githubActions.logout.success):
      return {}
    default:
      return state
  }
}

export default gists
