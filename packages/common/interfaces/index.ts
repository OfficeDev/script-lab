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
