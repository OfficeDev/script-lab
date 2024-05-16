import { createAction } from "typesafe-actions";

export const showLoginDialog = createAction("GITHUB_LOGIN_SHOW_DIALOG");
export const loginSuccessful = createAction("GITHUB_LOGIN_SUCCESS", (resolve) => {
  return (params: IGithubProcessedLoginInfo) => resolve(params);
});
export const cancelLogin = createAction("GITHUB_LOGIN_CANCEL");

export const logout = createAction("GITHUB_LOGOUT");

export interface IGithubProcessedLoginInfo {
  token: string;
  username: string;
  fullName: string;
  profilePicUrl: string;
}
