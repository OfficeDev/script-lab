import React from 'react'
import { Nav } from 'office-ui-fabric-react/lib/Nav'
import {
  getFocusStyle,
  mergeStyles,
  ITheme as IFabricTheme,
} from 'office-ui-fabric-react/lib/Styling'

// TODO: make it so that I don't cry when I look at this styling..
export interface IMenu {
  theme: ITheme
  fabricTheme: IFabricTheme
  items: any[]
  selectedKey: string
}

export class Menu extends React.Component<IMenu> {
  render(): JSX.Element {
    const { theme, fabricTheme, items, selectedKey } = this.props
    return (
      <Nav
        theme={fabricTheme}
        selectedKey={selectedKey}
        groups={[
          {
            links: items.map(item => ({
              name: item.label,
              key: item.key,
              icon: item.icon,
              iconProps: {
                iconName: item.icon,
                styles: {
                  root: { color: `${theme.white} !important`, marginRight: '1rem' },
                },
              },
              onClick: item.onClick,
              url: '',
            })),
          },
        ]}
        styles={{
          root: { width: '22rem', height: '100vh', background: theme.primary },
          link: mergeStyles(
            getFocusStyle(
              fabricTheme,
              undefined,
              undefined,
              undefined,
              theme.white,
              undefined,
            ),
            {
              backgroundColor: theme.primary,
              color: `${theme.white} !important`,
              height: '7rem',
              paddingLeft: '2rem',
              selectors: {
                '.ms-Nav-compositeLink:hover &': {
                  backgroundColor: theme.primaryDark,
                },
              },
            },
          ),
        }}
      />
    )
  }
}

export default Menu
