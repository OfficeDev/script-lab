import { IState } from '../reducer'

export const getToken = (state: IState): string | null => state.github.token

export const getProfilePicUrl = (state: IState): string | null =>
  state.github.profilePicUrl

export const getUsername = (state: IState): string | null => state.github.username

export const getIsLoggingInOrOut = (state: IState): boolean =>
  state.github.isLoggingInOrOut
