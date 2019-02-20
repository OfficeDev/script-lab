interface ISolution extends ISolutionWithoutFiles {
  files: IFile[];
}

interface ISolutionWithFileIds extends ISolutionWithoutFiles {
  files: string[];
}

interface ISolutionWithoutFiles extends IEditableSolutionProperties, ITimestamps {
  id: string;
  host: string;
}

interface IEditableSolutionProperties {
  name: string;
  description?: string;
  source?: ISourceInformation;
  options: Partial<ISolutionOptions>;
}

interface ISolutionOptions {
  isDirectScriptExecution: boolean;
  isCustomFunctionsSolution: boolean;
  isUntrusted: boolean;
}

interface ISourceInformation {
  id: string;
  origin: 'gist';
}

interface IFile extends IEditableFileProperties, ITimestamps {
  id: string;
}

interface IEditableFileProperties {
  name: string;
  language: string;
  content: string;
}

interface ITimestamps {
  dateCreated: number;
  dateLastModified: number;
  dateLastOpened: number;
}
