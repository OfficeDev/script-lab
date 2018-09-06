interface ITimestamps {
  dateCreated: number
  dateLastModified: number
}

interface IEditableSolutionProperties {
  name: string
  description?: string
  source?: ISourceInformation
}

interface ISourceInformation {
  id: string
  origin: 'gist'
}

interface ISolutionWithoutFiles extends IEditableSolutionProperties, ITimestamps {
  id: string
  host: string
}

interface ISolutionWithFileIds extends ISolutionWithoutFiles {
  files: string[]
}

interface ISolution extends ISolutionWithoutFiles {
  files: IFile[]
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
  host: string
  name: string
  fileName: string
  description: string
  rawUrl: string
  group: string
  api_set: any
}

interface ISampleMetadataByGroup {
  [group: string]: ISampleMetadata[]
}

interface ISharedGistMetadata extends ITimestamps {
  id: string
  host: string
  url: string
  title: string
  description: string
  isPublic: boolean
}
