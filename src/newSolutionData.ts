import uuidv4 from 'uuid'

export const getBoilerplateFiles = (timestamp: number): IFile[] =>
  [
    {
      name: 'index.ts',
      language: 'TypeScript',
      content: `// hello world ${new Date().toUTCString()}\n`,
    },
    { name: 'index.html', language: 'HTML', content: '<div>hello world</div>\n' },
    {
      name: 'index.css',
      language: 'CSS',
      content: 'div {\n\tbackground-color: #333\n}\n',
    },
  ].map(file => ({
    ...file,
    id: uuidv4(),
    dateCreated: timestamp,
    dateLastModified: timestamp,
  }))

export const getBoilerplateSolution = (files: IFile[], timestamp: number): ISolution => ({
  id: uuidv4(),
  name: `Blank Snippet`,
  host: 'WEB',
  dateCreated: timestamp,
  dateLastModified: timestamp,
  files: files.map(file => file.id),
  libraries: [],
})

export const getBoilerplate = (): { solution: ISolution; files: IFile[] } => {
  const timestamp = Date.now()

  const files = getBoilerplateFiles(timestamp)
  const solution = getBoilerplateSolution(files, timestamp)

  return { solution, files }
}
