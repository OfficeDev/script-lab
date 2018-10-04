import { HostType } from '@microsoft/office-js-helpers'
import Color from 'color'
import { loadTheme, createTheme } from 'office-ui-fabric-react/lib/Styling'

const neutralColors: IThemeNeutralColors = {
  black: '#000000',
  neutralDarker: '#1e1e1e',
  neutralDark: '#212121',
  neutralPrimary: '#333333',
  neutralSecondary: '#666666',
  neutralSecondaryLight: '#888888',
  neutralLight: '#eaeaea',
  neutralLighter: '#f4f4f4',
  white: '#ffffff',
}

export const getCommandBarFabricTheme = (host: string) => {
  const theme = getTheme(host)
  return createTheme({
    palette: {
      themePrimary: theme.white, // color used for icons in context menu
      themeDarkAlt: theme.neutralLighter, // used for icon colors
      neutralLighter: theme.primary, // bar background color
      neutralLight: theme.primaryDark, // bar hover color
      neutralQuaternaryAlt: theme.primaryLight, // active context menu color for button
      neutralSecondary: theme.white, // color of chevron for context menu
      neutralPrimary: theme.white, // normal text color
      neutralDark: theme.neutralLighter, // color of text on hover
      black: theme.white, // color of text on hover
      white: theme.neutralSecondary, // '#515151', // color of context menu background
    },
  })
}

export const getTheme = (host: string): ITheme => {
  const primary = primaryColors[host] || primaryColors[HostType.WEB]
  const primaryColor = Color(primary)
  return {
    primaryDarkest: primaryColor.darken(0.6).hex(),
    primaryDarker: primaryColor.darken(0.5).hex(),
    primaryDark: primaryColor.darken(0.3).hex(),
    primary: primaryColor.hex(),
    primaryLight: primaryColor.lighten(0.3).hex(),
    primaryLighter: primaryColor.lighten(0.5).hex(),
    primaryLightest: primaryColor.lighten(0.6).hex(),
    ...neutralColors,
  }
}

const primaryColors: { [key: string]: string } = {
  [HostType.WEB]: '#0078d4',
  [HostType.ACCESS]: '#B7472A',
  [HostType.EXCEL]: '#217346',
  [HostType.ONENOTE]: '#80397B',
  [HostType.OUTLOOK]: '#0173C7',
  [HostType.POWERPOINT]: '#B7472A',
  [HostType.PROJECT]: '#217346',
  [HostType.WORD]: '#2B579A',
}

// todo reconcile these two
export const fabricTheme = {
  themePrimary: '#217346',
  themeLighterAlt: '#f2f9f5',
  themeLighter: '#cee9da',
  themeLight: '#a8d5bc',
  themeTertiary: '#62ab83',
  themeSecondary: '#318456',
  themeDarkAlt: '#1e673f',
  themeDark: '#195735',
  themeDarker: '#134027',
  neutralLighterAlt: '#f8f8f8',
  neutralLighter: '#f4f4f4',
  neutralLight: '#eaeaea',
  neutralQuaternaryAlt: '#dadada',
  neutralQuaternary: '#d0d0d0',
  neutralTertiaryAlt: '#c8c8c8',
  neutralTertiary: '#c2c2c2',
  neutralSecondary: '#858585',
  neutralPrimaryAlt: '#4b4b4b',
  neutralPrimary: '#333',
  neutralDark: '#272727',
  black: '#1d1d1d',
  white: '#fff',
  primaryBackground: '#fff',
  primaryText: '#333',
  bodyBackground: '#fff',
  bodyText: '#333',
  disabledBackground: '#f4f4f4',
  disabledText: '#c8c8c8',
}

export const setupFabricTheme = (host: string) => {
  const theme = getTheme(host)

  const fabricTheme = {
    themePrimary: theme.primary,
    themeLighterAlt: theme.neutralLighter,
    themeLighter: theme.primaryLightest,
    themeLight: theme.primaryLighter,
    themeTertiary: theme.primaryLight,
    themeSecondary: theme.primary,
    themeDarkAlt: theme.primaryDark,
    themeDark: theme.primaryDarker,
    themeDarker: theme.primaryDarkest,
    neutralLighterAlt: theme.neutralLighter,
    neutralLighter: theme.neutralLighter,
    neutralLight: theme.neutralLight,
    neutralQuaternaryAlt: '#dadada',
    neutralQuaternary: '#d0d0d0',
    neutralTertiaryAlt: '#c8c8c8',
    neutralTertiary: '#c2c2c2',
    neutralSecondary: '#858585',
    neutralPrimaryAlt: '#4b4b4b',
    neutralPrimary: '#333',
    neutralDark: '#272727',
    black: '#1d1d1d',
    white: '#fff',
    primaryBackground: '#fff',
    primaryText: '#333',
    bodyBackground: '#fff',
    bodyText: '#333',
    disabledBackground: '#f4f4f4',
    disabledText: '#c8c8c8',
  }

  loadTheme({ palette: fabricTheme, isInverted: true })
}
