import { getBoilerplateSolution, getBoilerplateFiles } from './newSolutionData'

export const loadState = () => {
  try {
    const serializedState = localStorage.getItem('state')
    if (serializedState === null) {
      const files = getBoilerplateFiles()
      const solution = getBoilerplateSolution(files)
      return {
        solutions: {
          byId: {
            [solution.id]: solution,
          },
          allIds: [solution.id],
        },
        files: {
          byId: files.reduce(
            (byIdFiles, file) => ({ ...byIdFiles, [file.id]: file }),
            {},
          ),
          allIds: files.map(file => file.id),
        },
      }
    }
    return JSON.parse(serializedState)
  } catch (err) {
    return undefined
  }
}

export const saveState = state => {
  try {
    const serializedState = JSON.stringify(state)
    localStorage.setItem('state', serializedState)
  } catch (err) {
    // TODO
  }
}
