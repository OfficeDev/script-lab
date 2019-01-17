import { combineReducers } from 'redux';
import { getType } from 'typesafe-actions';

import { solutions as solutionActions, ISolutionsAction } from '../actions';

function normalizeSolutionName(
  state: IMetadataState,
  id: string,
  currentName?: string,
): { name?: string } {
  let name = currentName;
  if (!name) {
    return {};
  }

  const allNames = Object.keys(state)
    .map(k => state[k])
    .filter(s => s.id !== id)
    .map(s => s.name);

  if (allNames.includes(name)) {
    name = name.replace(/\(\d+\)$/gm, '').trim();
    let suffix = 1;
    while (allNames.includes(`${name} (${suffix})`)) {
      suffix++;
    }
    name = `${name} (${suffix})`;
  }
  return { name };
}

interface IMetadataState {
  [id: string]: ISolutionWithFileIds;
}

const metadata = (
  state: IMetadataState = {},
  action: ISolutionsAction,
): IMetadataState => {
  switch (action.type) {
    case getType(solutionActions.add):
      return {
        ...state,
        [action.payload.id]: {
          ...action.payload,
          ...normalizeSolutionName(state, action.payload.id, action.payload.name),
          files: action.payload.files.map(file => file.id),
        },
      };

    case getType(solutionActions.edit):
      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          ...action.payload.solution,
          ...normalizeSolutionName(
            state,
            action.payload.id,
            action.payload.solution ? action.payload.solution.name : undefined,
          ),
          dateLastModified: action.payload.timestamp,
        },
      };

    case getType(solutionActions.updateLastOpened):
      return {
        ...state,
        [action.payload.solutionId]: {
          ...state[action.payload.solutionId],
          dateLastOpened: action.payload.timestamp,
        },
      };

    case getType(solutionActions.deleteFromState):
      const { [action.payload.id]: omit, ...rest } = state;
      return rest;

    default:
      return state;
  }
};

interface IFilesState {
  [id: string]: IFile;
}

const files = (state: IFilesState = {}, action: ISolutionsAction): IFilesState => {
  switch (action.type) {
    case getType(solutionActions.add):
      const filesById = action.payload.files.reduce(
        (all, file) => ({ ...all, [file.id]: file }),
        {},
      );

      return {
        ...state,
        ...filesById,
      };

    case getType(solutionActions.edit):
      const { file, fileId } = action.payload;
      if (!file || !fileId) {
        return state;
      }

      return {
        ...state,
        [fileId]: {
          ...state[fileId],
          ...file,
          dateLastModified: action.payload.timestamp,
        },
      };

    case getType(solutionActions.updateLastOpened):
      return {
        ...state,
        [action.payload.fileId]: {
          ...state[action.payload.fileId],
          dateLastOpened: action.payload.timestamp,
        },
      };

    case getType(solutionActions.deleteFromState):
      const fileIdsToRemove = action.payload.files.map(file => file.id);
      return Object.keys(state)
        .map(k => state[k])
        .reduce((newState, f) => {
          if (!fileIdsToRemove.includes(f.id)) {
            newState[f.id] = f;
          }
          return newState;
        }, {});

    default:
      return state;
  }
};

export interface IState {
  metadata: IMetadataState;
  files: IFilesState;
}

export default combineReducers({
  metadata,
  files,
});
