import React from 'react'
import styled, { ThemeProvider } from 'styled-components'
import { loadTheme } from 'office-ui-fabric-react/lib/Styling'
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons'

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

const theme = {
  accent: '#217346',
  darkAccent: '#103822',
  bg: '#1e1e1e',
  fg: '#eeeeee',
}

export default theme

export const StyledComponentsThemeProvider = ({ children }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
)

export const setupFabricTheme = () => {
  loadTheme({ palette: fabricTheme })
  initializeIcons()
}
