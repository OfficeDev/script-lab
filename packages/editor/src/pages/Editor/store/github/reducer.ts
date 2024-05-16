import { combineReducers } from "redux";
import { github, IGithubAction, gists, IGistsAction } from "../actions";
import { getType } from "typesafe-actions";
import { IGithubProcessedLoginInfo } from "./actions";

type IGithubLoginInfoState = IGithubProcessedLoginInfo | null;
const loginInfo = (
  state: IGithubProcessedLoginInfo = null,
  action: IGithubAction | IGistsAction,
): IGithubLoginInfoState => {
  switch (action.type) {
    case getType(github.loginSuccessful):
      return action.payload;
    case getType(github.logout):
      return null;
    case getType(gists.fetchMetadata.failure):
      return action.payload.shouldLogUserOut ? null : state;
    default:
      return state;
  }
};

type IIsLoggingInOrOutState = boolean;
const isLoggingInOrOut = (
  state: IIsLoggingInOrOutState = false,
  action: IGithubAction,
): IIsLoggingInOrOutState => {
  switch (action.type) {
    case getType(github.showLoginDialog):
      return true;
    case getType(github.cancelLogin):
    case getType(github.loginSuccessful):
      return false;
    default:
      return state;
  }
};

type IIsAuthDialogVisibleState = boolean;
const isAuthDialogVisible = (
  state: IIsAuthDialogVisibleState = false,
  action: IGithubAction,
): IIsAuthDialogVisibleState => {
  switch (action.type) {
    case getType(github.showLoginDialog):
      return true;
    case getType(github.cancelLogin):
    case getType(github.loginSuccessful):
      return false;
    default:
      return state;
  }
};

export interface IState {
  loginInfo: IGithubLoginInfoState;
  isLoggingInOrOut: IIsLoggingInOrOutState;
  isAuthDialogVisible: IIsAuthDialogVisibleState;
}

export default combineReducers<IState, IGithubAction>({
  loginInfo,
  isLoggingInOrOut,
  isAuthDialogVisible,
});
