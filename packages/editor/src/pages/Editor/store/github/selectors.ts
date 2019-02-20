import { IState } from '../reducer';
import { createSelector } from 'reselect';

export const getToken = (state: IState): string | null =>
  state.github.loginInfo ? state.github.loginInfo.token : null;

export const getProfilePicUrl = (state: IState): string | null =>
  state.github.loginInfo ? state.github.loginInfo.profilePicUrl : null;

export const getUsername = (state: IState): string | null =>
  state.github.loginInfo ? state.github.loginInfo.username : null;

export const getIsLoggingInOrOut = (state: IState): boolean =>
  state.github.isLoggingInOrOut;

export const getIsAuthDialogOpen = (state: IState): boolean =>
  state.github.isAuthDialogVisible;

export const getIsLoggedIn: (state: IState) => boolean = createSelector(
  [getToken],
  token => !!token,
);
