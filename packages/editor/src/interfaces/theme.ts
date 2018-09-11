interface IThemePrimaryColors {
  primaryDarkest: string
  primaryDarker: string
  primaryDark: string
  primary: string
  primaryLight: string
  primaryLighter: string
  primaryLightest: string
}

interface IThemeNeutralColors {
  black: string
  neutralDark: string
  neutralPrimary: string
  neutralSecondary: string
  neutralSecondaryLight: string
  neutralLight: string
  neutralLighter: string
  white: string
}

interface ITheme extends IThemePrimaryColors, IThemeNeutralColors {}
