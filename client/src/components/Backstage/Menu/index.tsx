import React from 'react'
import { Nav } from 'office-ui-fabric-react/lib/Nav'
import {
  createTheme,
  getFocusStyle,
  mergeStyles,
} from 'office-ui-fabric-react/lib/Styling'

const theme = createTheme({
  palette: {
    themePrimary: 'white',
    neutralLighterAlt: 'rgba(0, 0, 0, 0.4)',
    neutralLighter: 'rgba(0, 0, 0, 0.2)',
    neutralPrimary: 'rgba(255, 255, 255, 0.8)',
    white: '#217346',
  },
})
// TODO: make it so that I don't cry when I look at this styling..
export class Menu extends React.Component<any, any> {
  render(): JSX.Element {
    return (
      <Nav
        theme={theme}
        selectedKey={this.props.selectedKey}
        groups={[
          {
            links: this.props.items.map(item => ({
              name: item.label,
              key: item.key,
              icon: item.icon,
              iconProps: {
                iconName: item.icon,
                styles: { root: { color: 'white !important', marginRight: '1rem' } },
              },
              onClick: item.onClick,
              url: '',
            })),
          },
        ]}
        styles={{
          root: { width: '22rem', height: '100vh', background: '#217346' },
          link: mergeStyles(
            getFocusStyle(theme, undefined, undefined, undefined, 'white', undefined),
            {
              color: 'white !important',
              height: '7rem',
              paddingLeft: '2rem',
            },
          ),
        }}
      />
    )
  }
}

export default Menu
