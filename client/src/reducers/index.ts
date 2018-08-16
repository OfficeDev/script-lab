import { combineReducers } from 'redux'
import { RouterState } from 'connected-react-router'
import pathToRegexp from 'path-to-regexp'

// reducers + selectors
import solutions, { selectors as solutionSelectors, ISolutionsState } from './solutions'
import files, { selectors as fileSelectors, IFilesState } from './files'
import samples, { selectors as sampleSelectors } from './samples'
import github, { selectors as githubSelectors } from './github'
import messageBar, {
  selectors as messageBarSelectors,
  IMessageBarState,
} from './messageBar'
import settings, { selectors as settingsSelectors } from './settings'

const root = combineReducers({
  solutions,
  files,
  samples,
  github,
  messageBar,
  settings,
})

export interface IState {
  solutions: ISolutionsState
  files: IFilesState
  samples: any
  github: any
  messageBar: IMessageBarState
  router: RouterState
  settings: ISettings
}

export default root

// global state selectors

const globalizeSelectors = (localSelectors, selectorType) =>
  Object.keys(localSelectors).reduce(
    (globalizedLocalSelectors, localSelectorName) => ({
      ...globalizedLocalSelectors,
      [localSelectorName]: (state, ...args) =>
        localSelectors[localSelectorName](state[selectorType], ...args),
    }),
    localSelectors,
  )

const solutionPathRegex = pathToRegexp('/:solutionId?/:fileId?')

const getActiveSolution = (state: IState): ISolution => {
  const [path, pathSolutionId, pathFileId] = solutionPathRegex.exec(
    state.router.location.pathname,
  )
  const allSolutions = solutionSelectors.getInLastModifiedOrder(state.solutions)
  const allSolutionIds = solutionSelectors.getAllIds(state.solutions)
  return pathSolutionId && allSolutionIds.includes(pathSolutionId)
    ? solutionSelectors.get(state.solutions, pathSolutionId)!
    : allSolutions[0]
}

const getActiveFile = (state: IState): IFile => {
  const [path, pathSolutionId, pathFileId] = solutionPathRegex.exec(
    state.router.location.pathname,
  )

  const solution = getActiveSolution(state)
  return pathFileId && solution.files.includes(pathFileId)
    ? fileSelectors.get(state.files, pathFileId)
    : fileSelectors.get(state.files, solution.files[0])
}

export const selectors = {
  solutions: globalizeSelectors(solutionSelectors, 'solutions'),
  files: globalizeSelectors(fileSelectors, 'files'),
  samples: globalizeSelectors(sampleSelectors, 'samples'),
  github: globalizeSelectors(githubSelectors, 'github'),
  messageBar: globalizeSelectors(messageBarSelectors, 'messageBar'),
  settings: globalizeSelectors(settingsSelectors, 'settings'),
  active: {
    solution: getActiveSolution,
    files: (state: IState) =>
      getActiveSolution(state).files.map(fileId =>
        fileSelectors.get(state.files, fileId),
      ),
    file: getActiveFile,
  },
}

// TODO: figure out if there's a way to incorp. typings, else use bottom implementation

// export const selectors = {
//   solutions: {
//     get: (state, id: string): ISolution => solutionSelectors.get(state.solutions, id),
//     getAll: (state): ISolution[] => solutionSelectors.getAll(state.solutions),
//   },
//   files: {
//     get: (state, id: string): IFile => fileSelectors.get(state.files, id),
//   },
// }
