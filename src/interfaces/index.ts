interface ITimestamps {
  dateCreated: number
  dateLastModified: number
}

export interface IEditableSolutionProperties {
  name: string
  description?: string
}

export interface ISolution extends IEditableSolutionProperties, ITimestamps {
  id: string
  files: string[] // IFile id's
}

export interface IEditableFileProperties {
  name: string
  content: string
}

export interface IFile extends IEditableFileProperties, ITimestamps {
  id: string
}
