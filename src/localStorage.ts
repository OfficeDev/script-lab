import { getBoilerplate } from './newSolutionData'
import { selectors } from './reducers'
import { convertSolutionToSnippet } from './utils'

export const loadState = () => {
  try {
    const serializedSolutions = localStorage.getItem('solutions')
    const serializedFiles = localStorage.getItem('files')
    if (serializedSolutions === null || serializedFiles === null) {
      const { solution, files } = getBoilerplate()

      return {
        solutions: { byId: { [solution.id]: solution }, allIds: [solution.id] },
        files: {
          byId: files.reduce(
            (byIdFiles, file) => ({ ...byIdFiles, [file.id]: file }),
            {},
          ),
          allIds: files.map(file => file.id),
        },
      }
    } else {
      const solutions = JSON.parse(serializedSolutions)
      const files = JSON.parse(serializedFiles)
      return { solutions, files }
    }
  } catch (err) {
    return { solutions: { byId: {}, allIds: [] }, files: { byId: {}, allIds: [] } }
  }
}

export const saveState = state => {
  try {
    const { solutions, files } = state
    const serializedSolutions = JSON.stringify(solutions)
    const serializedFiles = JSON.stringify(files)
    localStorage.setItem('solutions', serializedSolutions)
    localStorage.setItem('files', serializedFiles)

    const activeSolution = selectors.active.solution(state)
    const activeFiles = selectors.active.files(state)
    const activeSnippet = convertSolutionToSnippet(activeSolution, activeFiles)

    localStorage.setItem('activeSnippet', JSON.stringify(activeSnippet))
  } catch (err) {
    // TODO
  }
}
