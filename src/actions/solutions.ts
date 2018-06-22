import { createAction } from 'typesafe-actions'
import uuidv4 from 'uuid'
import { add as addFiles } from './files'
import { push } from 'connected-react-router'

export const add = createAction('SOLUTIONS_ADD', resolve => {
  return (solution: ISolution) => resolve(solution)
})

export const edit = createAction('SOLUTIONS_EDIT', resolve => {
  return (id: string, solution: Partial<IEditableSolutionProperties>) =>
    resolve({ id, solution })
})

export const remove = createAction('SOLUTIONS_REMOVE', resolve => {
  return (id: string) => resolve(id)
})

export const create = () => dispatch => {
  const now = Date.now()

  const files = [
    {
      name: 'index.ts',
      language: 'TypeScript',
      content: `// hello world ${new Date().toUTCString()}\n`,
    },
    {
      name: 'index.html',
      language: 'HTML',
      content: '<div>hello world</div>\n',
    },
    {
      name: 'index.css',
      language: 'CSS',
      content: 'div {\n\tbackground-color: #333\n}\n',
    },
  ].map(file => ({
    ...file,
    id: uuidv4(),
    dateCreated: now,
    dateLastModified: now,
  }))

  const solutionId = uuidv4()

  const solution: ISolution = {
    id: solutionId,
    name: `New Snippet`,
    dateCreated: now,
    dateLastModified: now,
    files: files.map(file => file.id),
  }

  dispatch(addFiles(files))
  dispatch(add(solution))
  dispatch(push(`/edit/${solutionId}`))
}
