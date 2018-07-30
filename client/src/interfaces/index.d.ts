interface ITimestamps {
  dateCreated: number
  dateLastModified: number
}

interface IEditableSolutionProperties {
  name: string
  description?: string
  libraries: string[]
}

interface ISolution extends IEditableSolutionProperties, ITimestamps {
  id: string
  gistId?: string
  host: string
  files: string[]
}

interface IEditableFileProperties {
  name: string
  language: string
  content: string
}

interface IFile extends IEditableFileProperties, ITimestamps {
  id: string
}

interface ISampleMetadata {
  id: string
  name: string
  fileName: string
  description: string
  rawUrl: string
  group: string
  api_set: any
}

interface ISharedGistMetadata extends ITimestamps {
  id: string
  url: string
  title: string
  description: string
  isPublic: boolean
}
