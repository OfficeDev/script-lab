import uuidv4 from 'uuid'

export const getBoilerplateFiles = (): IFile[] =>
  [
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
    dateCreated: Date.now(),
    dateLastModified: Date.now(),
  }))

export const getBoilerplateSolution = (files: IFile[]): ISolution => ({
  id: uuidv4(),
  name: `Blank Snippet`,
  dateCreated: Date.now(),
  dateLastModified: Date.now(),
  files: files.map(file => file.id),
})

export const getBoilerplate = (): { solution: ISolution; files: IFile[] } => {
  const files = getBoilerplateFiles()
  const solution = getBoilerplateSolution(files)

  return { solution, files }
}
