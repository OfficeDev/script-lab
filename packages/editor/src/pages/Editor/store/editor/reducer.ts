import { combineReducers } from 'redux';
import { getType } from 'typesafe-actions';
import { editor, IEditorAction } from '../actions';
import omit from 'lodash/omit';

type IIsVisibleState = boolean;

const initialVisibility = true;

const isVisible = (state: IIsVisibleState = initialVisibility, action) => {
  switch (action.type) {
    case getType(editor.open):
      return true;
    case getType(editor.hide):
      return false;
    case getType(editor.openBackstage):
      return false;
    case getType(editor.hideBackstage):
      return true;

    default:
      return state;
  }
};

type IIsBackstageVisibleState = boolean;

const initialBackstageVisibility = false;

const isBackstageVisible = (
  state: IIsBackstageVisibleState = initialBackstageVisibility,
  action: IEditorAction,
) => {
  switch (action.type) {
    case getType(editor.openBackstage):
      return true;
    case getType(editor.hideBackstage):
      return false;
    case getType(editor.open):
      return false;

    default:
      return state;
  }
};

type IHasLoadedState = boolean;

const hasLoaded = (state: IHasLoadedState = false, action) => {
  switch (action.type) {
    case getType(editor.onMount):
      return true;
    default:
      return state;
  }
};

interface IIntellisenseFilesState {
  [url: string]: monaco.IDisposable;
}

const intellisenseFiles = (
  state: IIntellisenseFilesState = {},
  action: IEditorAction,
) => {
  switch (action.type) {
    case getType(editor.setIntellisenseFiles.success):
      return { ...state, ...action.payload };
    case getType(editor.removeIntellisenseFiles):
      return omit({ ...state }, action.payload);
    default:
      return state;
  }
};

interface IActiveState {
  solutionId: string | null;
  fileId: string | null;
}

const active = (
  state: IActiveState = { solutionId: null, fileId: null },
  action: IEditorAction,
) => {
  switch (action.type) {
    case getType(editor.setActive):
      return action.payload;
    default:
      return state;
  }
};

export interface IState {
  isVisible: IIsVisibleState;
  isBackstageVisible: IIsBackstageVisibleState;
  hasLoaded: IHasLoadedState;
  intellisenseFiles: IIntellisenseFilesState;
  active: IActiveState;
}

export default combineReducers({
  isVisible,
  isBackstageVisible,
  hasLoaded,
  intellisenseFiles,
  active,
});
