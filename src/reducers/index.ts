import { combineReducers } from 'redux'

// reducers + selectors
import solutions, { selectors as solutionSelectors } from './solutions'
import files, * as fileSelectors from './files'

const root = combineReducers({
  solutions,
  files,
})

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

export const selectors = {
  solutions: globalizeSelectors(solutionSelectors, 'solutions'),
  files: globalizeSelectors(fileSelectors, 'files'),
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
