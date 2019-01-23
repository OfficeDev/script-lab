import { combineReducers } from 'redux';
import { github, IGithubAction, gists, IGistsAction } from '../actions';
import { getType } from 'typesafe-actions';

type ITokenState = string | null;
const token = (
  state: ITokenState = null,
  action: IGithubAction | IGistsAction,
): ITokenState => {
  switch (action.type) {
    case getType(github.login.success):
      return action.payload.token;
    case getType(github.logout.success):
    case getType(github.login.failure):
      return null;
    case getType(gists.fetchMetadata.failure):
      return action.payload.shouldLogUserOut ? null : state;
    default:
      return state;
  }
};

type IProfilePicUrlState = string | null;
const profilePicUrl = (
  state: IProfilePicUrlState = null,
  action: IGithubAction | IGistsAction,
): IProfilePicUrlState => {
  switch (action.type) {
    case getType(github.login.success):
      return action.payload.profilePicUrl;
    case getType(github.logout.success):
    case getType(github.login.failure):
      return null;
    case getType(gists.fetchMetadata.failure):
      return action.payload.shouldLogUserOut ? null : state;
    default:
      return state;
  }
};

type IUsernameState = string | null;
const username = (
  state: IUsernameState = null,
  action: IGithubAction | IGistsAction,
): IUsernameState => {
  switch (action.type) {
    case getType(github.login.success):
      return action.payload.username;
    case getType(github.logout.success):
    case getType(github.login.failure):
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
    case getType(github.login.request):
    case getType(github.logout.request):
      return true;
    case getType(github.login.success):
    case getType(github.login.failure):
    case getType(github.logout.success):
    case getType(github.logout.failure):
      return false;
    default:
      return state;
  }
};

export interface IState {
  token: ITokenState;
  profilePicUrl: IProfilePicUrlState;
  username: IUsernameState;
  isLoggingInOrOut: IIsLoggingInOrOutState;
}

export default combineReducers({ token, profilePicUrl, username, isLoggingInOrOut });
