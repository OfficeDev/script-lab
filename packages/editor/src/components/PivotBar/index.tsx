import React from 'react'
import styled, { withTheme } from 'styled-components'
import {
  Pivot,
  PivotItem,
  PivotLinkFormat,
  PivotLinkSize,
} from 'office-ui-fabric-react/lib/Pivot'

const PivotBarWrapper = styled.div`
  background-color: ${props => props.theme.primaryDarker};
  z-index: 1000;
`

export interface IPivotBarItem {
  key: string
  text: string
}

export interface IPivotBar {
  items: IPivotBarItem[]
  selectedKey: string | null
  onSelect: (selectedKey: string) => void
  theme: ITheme // from withTheme

  backgroundColor?: string
  selectedColor?: string
}

class PivotBar extends React.Component<IPivotBar> {
  render() {
    const { items, selectedKey, theme, backgroundColor, selectedColor } = this.props

    return (
      <PivotBarWrapper>
        <Pivot
          linkSize={PivotLinkSize.normal}
          linkFormat={PivotLinkFormat.tabs}
          onLinkClick={this.onLinkClick}
          selectedKey={selectedKey || undefined}
          styles={{
            root: { backgroundColor: backgroundColor || theme.primaryDarker },
            link: {
              backgroundColor: backgroundColor || theme.primaryDarker,
              selectors: {
                ':hover': { backgroundColor: 'rgba(0, 0, 0, 0.1)' },
                ':active': { backgroundColor: selectedColor || theme.primaryDarkest },
              },
            },
            linkIsSelected: {
              backgroundColor: selectedColor || theme.primaryDarkest,
              selectors: {
                ':before': {
                  borderBottom: `2px solid ${theme.white}`,
                },
              },
            },
            linkContent: { color: theme.white, fontWeight: '400' },
          }}
        >
          {items.map(item => (
            <PivotItem key={item.key} itemKey={item.key} linkText={item.text} />
          ))}
        </Pivot>
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

export default withTheme(PivotBar)
