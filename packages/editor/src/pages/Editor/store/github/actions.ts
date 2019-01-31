import { createAsyncAction } from 'typesafe-actions';

export const login = createAsyncAction(
  'GITHUB_LOGIN_REQUEST',
  'GITHUB_LOGIN_SUCCESS',
  'GITHUB_LOGIN_FAILURE',
)<void, IGithubLoginInfo, Error>();

export const logout = createAsyncAction(
  'GITHUB_LOGOUT_REQUEST',
  'GITHUB_LOGOUT_SUCCESS',
  'GITHUB_LOGOUT_FAILURE',
)<void, void, Error>();

export interface IGithubLoginInfo {
  token: string;
  username: string;
  profilePicUrl: string;
}
