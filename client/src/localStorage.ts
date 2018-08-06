import { getBoilerplate } from './newSolutionData'
import { selectors } from './reducers'
import { convertSolutionToSnippet } from './utils'

const statifySolution = ({ solution, files }) => ({
  solutions: { byId: { [solution.id]: solution }, allIds: [solution.id] },
  files: {
    byId: files.reduce((byIdFiles, file) => ({ ...byIdFiles, [file.id]: file }), {}),
    allIds: files.map(file => file.id),
  },
})

export const loadState = () => {
  try {
    let solutions
    let files
    let github

    const serializedSolutions = localStorage.getItem('solutions')
    const serializedFiles = localStorage.getItem('files')
    const serializedGithub = localStorage.getItem('github')

    if (serializedSolutions === null || serializedFiles === null) {
      const state = statifySolution(getBoilerplate())
      solutions = state.solutions
      files = state.files
    } else {
      solutions = JSON.parse(serializedSolutions)
      files = JSON.parse(serializedFiles)
    }

    github = serializedGithub === null ? {} : JSON.parse(serializedGithub)

    return { solutions, files, github }
  } catch (err) {
    return {
      solutions: { byId: {}, allIds: [] },
      files: { byId: {}, allIds: [] },
      github: {},
    }
  }
}

export const saveState = state => {
  try {
    const { solutions, files, github } = state
    const serializedSolutions = JSON.stringify(solutions)
    const serializedFiles = JSON.stringify(files)
    const serializedGithub = JSON.stringify(github)

    localStorage.setItem('solutions', serializedSolutions)
    localStorage.setItem('files', serializedFiles)
    localStorage.setItem('github', serializedGithub)

    const activeSolution = selectors.active.solution(state)
    const activeFiles = selectors.active.files(state)
    const activeSnippet = convertSolutionToSnippet(activeSolution, activeFiles)

    localStorage.setItem('activeSnippet', JSON.stringify(activeSnippet))
  } catch (err) {
    // TODO
  }
}
