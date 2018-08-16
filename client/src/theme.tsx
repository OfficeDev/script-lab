import { HostType } from '@microsoft/office-js-helpers'
import Color from 'color'
import { loadTheme, createTheme } from 'office-ui-fabric-react/lib/Styling'
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons'

const neutralColors: IThemeNeutralColors = {
  black: '#000000',
  neutralDark: '#212121',
  neutralPrimary: '#333333',
  neutralSecondary: '#666666',
  neutralLight: '#eaeaea',
  neutralLighter: '#f4f4f4',
  white: '#ffffff',
}

// TODO(nicobell): incorp. into header
export const getHeaderFabricTheme = (theme: ITheme) => {
  return createTheme({
    palette: {
      themePrimary: theme.white, // color used for icons in context menu
      themeDarkAlt: '#eaeaea', // used for icon colors
      neutralLighter: '#217346', // bar background color
      neutralLight: '#35875a', // bar hover color
      neutralQuaternaryAlt: '#3b8d60', // active context menu color for button
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
    primaryDarker: primaryColor.darken(0.5).hex(),
    primaryDark: primaryColor.darken(0.25).hex(),
    primary: primaryColor.hex(),
    primaryLight: primaryColor.lighten(0.25).hex(),
    primaryLighter: primaryColor.lighten(0.5).hex(),
    ...neutralColors,
  }
}

export const defaultTheme = {
  accent: '#217346',
  darkAccent: '#0D4027',
  bg: '#1e1e1e',
  fg: '#eeeeee',
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

export const headerTheme = createTheme({
  palette: {
    themePrimary: '#ffffff', // color used for icons in context menu
    themeDarkAlt: '#eaeaea', // used for icon colors
    neutralLighter: '#217346', // bar background color
    neutralLight: '#35875a', // bar hover color
    neutralQuaternaryAlt: '#3b8d60', // active context menu color for button
    neutralSecondary: '#ffffff', // color of chevron for context menu
    neutralPrimary: '#ffffff', // normal text color
    neutralDark: '#f4f4f4', // color of text on hover
    black: '#f8f8f8', // color of text on hover
    white: '#515151', // color of context menu background
  },
})

export const setupFabricTheme = () => {
  loadTheme({ palette: fabricTheme })
  initializeIcons()
}
