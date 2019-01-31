import { createAsyncAction } from 'typesafe-actions';

// FIXME this might be boil-down-able to just one action
export const login = createAsyncAction(
  'GITHUB_LOGIN_REQUEST',
  'GITHUB_LOGIN_SUCCESS',
  'GITHUB_LOGIN_FAILURE',
)<void, IGithubProcessedLoginInfo, Error>();

export const logout = createAsyncAction(
  'GITHUB_LOGOUT_REQUEST',
  'GITHUB_LOGOUT_SUCCESS',
  'GITHUB_LOGOUT_FAILURE',
)<void, void, Error>();

export interface IGithubProcessedLoginInfo {
  token: string;
  username: string;
  fullName: string;
  profilePicUrl: string;
}
