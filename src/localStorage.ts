import { getBoilerplateSolution, getBoilerplateFiles } from './newSolutionData'

export const loadState = () => {
  try {
    const serializedSolutions = localStorage.getItem('solutions')
    const serializedFiles = localStorage.getItem('files')
    if (serializedSolutions === null || serializedFiles === null) {
      const bpFiles = getBoilerplateFiles()
      const solution = getBoilerplateSolution(bpFiles)
      return {
        solutions: {
          byId: {
            [solution.id]: solution,
          },
          allIds: [solution.id],
        },
        files: {
          byId: bpFiles.reduce(
            (byIdFiles, file) => ({ ...byIdFiles, [file.id]: file }),
            {},
          ),
          allIds: bpFiles.map(file => file.id),
        },
      }
    }
    const solutions = JSON.parse(serializedSolutions)
    const files = JSON.parse(serializedFiles)
    return { solutions, files }
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
  } catch (err) {
    // TODO
  }
}
