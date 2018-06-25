interface ITimestamps {
  dateCreated: number
  dateLastModified: number
}

interface IEditableSolutionProperties {
  name: string
  description?: string
}

interface ISolution extends IEditableSolutionProperties, ITimestamps {
  id: string
  files: string[] // IFile id's
}

interface IEditableFileProperties {
  name: string
  language: string
  content: string
}

interface IFile extends IEditableFileProperties, ITimestamps {
  id: string
}
