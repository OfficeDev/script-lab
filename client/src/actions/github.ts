import { createAction, createAsyncAction } from 'typesafe-actions'

export const login = createAsyncAction(
  'GITHUB_LOGIN_REQUEST',
  'GITHUB_LOGIN_SUCCESS',
  'GITHUB_LOGIN_FAILURE',
)<void, { token: string; profilePic: string }, Error>()

export const logout = createAction('GITHUB_LOGOUT')
