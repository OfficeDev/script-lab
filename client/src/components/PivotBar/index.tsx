import React from 'react'
import styled from 'styled-components'
import {
  Pivot,
  PivotItem,
  PivotLinkFormat,
  PivotLinkSize,
} from 'office-ui-fabric-react/lib/Pivot'

import { Customizer } from 'office-ui-fabric-react/lib/Utilities'

import theme, { pivotBarTheme } from '../../theme'

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
        <Customizer settings={{ theme: pivotBarTheme }}>
          <Pivot
            linkSize={PivotLinkSize.normal}
            linkFormat={PivotLinkFormat.tabs}
            onLinkClick={this.onLinkClick}
            selectedKey={selectedKey || undefined}
            styles={{
              root: { backgroundColor: theme.darkAccent },
              link: { backgroundColor: theme.darkAccent },
              linkIsSelected: {
                borderBottom: `1px solid ${theme.fg}`,
              },
              linkContent: { color: theme.fg, fontWeight: '400' },
            }}
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
