import { createAction } from '../../../../utils/typesafe-telemetry-actions';

export const showLoginDialog = createAction('GITHUB_LOGIN_SHOW_DIALOG')();
export const loginSuccessful = createAction('GITHUB_LOGIN_SUCCESS')<
  IGithubProcessedLoginInfo
>({ getTelemetryData: type => ({ type }) });

export const cancelLogin = createAction('GITHUB_LOGIN_CANCEL')();

export const logout = createAction('GITHUB_LOGOUT')({
  getTelemetryData: type => ({ type }),
});

export interface IGithubProcessedLoginInfo {
  token: string;
  username: string;
  fullName: string;
  profilePicUrl: string;
}
