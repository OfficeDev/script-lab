import { combineReducers } from 'redux';
import { getType } from 'typesafe-actions';
import { defaultSettings } from './utilities';
import { settings as settingsActions, ISettingsAction } from '../actions';

const userSettings = (
  state: Partial<ISettings> = defaultSettings,
  action: ISettingsAction,
) => {
  switch (action.type) {
    case getType(settingsActions.edit.success):
      return action.payload.userSettings;
    default:
      return state;
  }
};

interface ILastActive {
  solutionId: string | null;
  fileId: string | null;
}

const initialLastActiveState = {
  solutionId: null,
  fileId: null,
};

const lastActive = (
  state: ILastActive = initialLastActiveState,
  action: ISettingsAction,
) => {
  switch (action.type) {
    case getType(settingsActions.setLastActive):
      const { solutionId, fileId } = action.payload;
      return { solutionId, fileId };
    default:
      return state;
  }
};

export interface IState {
  userSettings: Partial<ISettings>;
  lastActive: ILastActive;
}

export default combineReducers({ userSettings, lastActive });
