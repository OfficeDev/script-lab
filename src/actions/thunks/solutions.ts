import { ISolution } from '../../interfaces'
import uuidv4 from 'uuid'
import { add as addFiles } from '../files'
import { add as addSolution } from '../solutions'

export const create = () => dispatch => {
  const now = Date.now()

  const files = [
    {
      name: 'index.ts',
      content: `// hello world ${new Date().toUTCString()}\n`,
    },
    {
      name: 'index.html',
      content: '<div>hello world</div>\n',
    },
    {
      name: 'index.css',
      content: 'div {\n\tbackground-color: #333\n}\n',
    },
  ].map(file => ({
    ...file,
    id: uuidv4(),
    dateCreated: now,
    dateLastModified: now,
  }))

  const solution: ISolution = {
    id: uuidv4(),
    name: `New Snippet @ ${new Date().toISOString()}`,
    dateCreated: now,
    dateLastModified: now,
    files: files.map(file => file.id),
  }

  dispatch(addFiles(files))
  dispatch(addSolution(solution))
}
