import { IState } from '../reducer'

export const getToken = (state: IState): string | undefined => state.github.token
export const getProfilePicUrl = (state: IState): string | undefined =>
  state.github.profilePicUrl
