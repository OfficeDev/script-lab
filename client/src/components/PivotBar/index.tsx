import React from 'react'
import styled from 'styled-components'
import {
  Pivot,
  PivotItem,
  PivotLinkFormat,
  PivotLinkSize,
} from 'office-ui-fabric-react/lib/Pivot'

import { createTheme } from 'office-ui-fabric-react/lib/Styling'
import { Customizer } from 'office-ui-fabric-react/lib/Utilities'

const pivotTheme = createTheme({
  palette: {
    themePrimary: '#0a331f',
    themeLighterAlt: '#f2f9f5',
    themeLighter: '#cee9da',
    themeLight: '#a8d5bc',
    themeTertiary: '#62ab83',
    themeSecondary: '#318456',
    themeDarkAlt: '#1e673f',
    themeDark: '#195735',
    themeDarker: '#134027',
    neutralLighterAlt: '#f8f8f8',
    neutralLighter: '#134027',
    neutralLight: '#eaeaea',
    neutralQuaternaryAlt: '#dadada',
    neutralQuaternary: '#d0d0d0',
    neutralTertiaryAlt: '#c8c8c8',
    neutralTertiary: '#c2c2c2',
    neutralSecondary: '#858585',
    neutralPrimaryAlt: '#4b4b4b',
    neutralPrimary: '#fff',
    neutralDark: '#272727',
    black: '#fff',
    white: '#fff',
  },
})

const PivotBarWrapper = styled.div`
  background-color: ${props => props.theme.darkAccent};
`

export interface IPivotBarItem {
  key: string
  text: string
}

export interface IPivotBar {
  items: IPivotBarItem[]
  selectedKey: string | null
  onSelect: (selectedKey: string) => void
}

class PivotBar extends React.Component<IPivotBar> {
  render() {
    const { items, selectedKey } = this.props

    return (
      <PivotBarWrapper>
        <Customizer settings={{ theme: pivotTheme }}>
          <Pivot
            linkSize={PivotLinkSize.normal}
            linkFormat={PivotLinkFormat.tabs}
            onLinkClick={this.onLinkClick}
            selectedKey={selectedKey || undefined}
          >
            {items.map(item => (
              <PivotItem key={item.key} itemKey={item.key} linkText={item.text} />
            ))}
          </Pivot>
        </Customizer>
      </PivotBarWrapper>
    )
  }

  onLinkClick = (item: PivotItem): void => {
    const key = item.props.itemKey
    if (key) {
      this.props.onSelect(key)
    }
  }
}

export default PivotBar
