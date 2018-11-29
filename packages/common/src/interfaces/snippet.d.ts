// script-lab
interface ISnippet {
  id?: string;
  gist?: string;
  gistOwnerId?: string;
  name: string;
  description?: string;
  /** author: export-only */
  author?: string;
  host: string;
  /** api_set: export-only (+ check at first level of import) */
  api_set?: {
    [index: string]: number;
  };
  order?: number;

  script?: IContentLanguagePair;
  template?: IContentLanguagePair;
  style?: IContentLanguagePair;
  libraries?: string;
}

interface IContentLanguagePair {
  content: string;
  language: string;
}

// SOLUTION
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
}

// SAMPLES
interface ISampleMetadata {
  id: string;
  host: string;
  name: string;
  fileName: string;
  description: string;
  rawUrl: string;
  group: string;
  api_set: any;
}

interface ISampleMetadataByGroup {
  [group: string]: ISampleMetadata[];
}

// GIST
interface ISharedGistMetadata {
  id: string;
  host: string;
  url: string;
  title: string;
  description: string;
  isPublic: boolean;
}

// THEME
interface IThemePrimaryColors {
  primaryDarkest: string;
  primaryDarker: string;
  primaryDark: string;
  primary: string;
  primaryLight: string;
  primaryLighter: string;
  primaryLightest: string;
}

interface IThemeNeutralColors {
  black: string;
  neutralDarker: string;
  neutralDark: string;
  neutralPrimary: string;
  neutralSecondary: string;
  neutralSecondaryLight: string;
  neutralLight: string;
  neutralLighter: string;
  white: string;
}

interface ITheme extends IThemePrimaryColors, IThemeNeutralColors {}
