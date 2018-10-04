// script-lab
interface IContentLanguagePair {
  content: string;
  language: string;
}

interface ISnippet {
  id: string;
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
  platform: string;
  created_at: number;
  modified_at: number;
  order?: number;

  script: IContentLanguagePair;
  template: IContentLanguagePair;
  style: IContentLanguagePair;
  libraries: string;
}

interface ITimestamps {
  dateCreated: number;
  dateLastModified: number;
}

interface IEditableSolutionProperties {
  name: string;
  description?: string;
  source?: ISourceInformation;
}

interface ISourceInformation {
  id: string;
  origin: 'gist';
}

interface ISolutionWithoutFiles extends IEditableSolutionProperties, ITimestamps {
  id: string;
  host: string;
}

interface ISolutionWithFileIds extends ISolutionWithoutFiles {
  files: string[];
}

interface ISolution extends ISolutionWithoutFiles {
  files: IFile[];
}

interface IEditableFileProperties {
  name: string;
  language: string;
  content: string;
}

interface IFile extends IEditableFileProperties, ITimestamps {
  id: string;
}

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

interface ISharedGistMetadata {
  id: string;
  host: string;
  url: string;
  title: string;
  description: string;
  isPublic: boolean;
}

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
