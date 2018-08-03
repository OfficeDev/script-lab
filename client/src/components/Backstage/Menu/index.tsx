import React from 'react'
import { Nav } from 'office-ui-fabric-react/lib/Nav'
import { createTheme } from 'office-ui-fabric-react/lib/Styling'

// TODO: make it so that I don't cry when I look at this styling..
// TODO: make it so that the outline for keyboard nav has higher contrast
export class Menu extends React.Component<any, any> {
  render(): JSX.Element {
    return (
      <Nav
        theme={createTheme({
          palette: {
            themePrimary: 'white',
            neutralLighterAlt: 'rgba(0, 0, 0, 0.4)',
            neutralLighter: 'rgba(0, 0, 0, 0.2)',
            neutralPrimary: 'rgba(255, 255, 255, 0.8)',
            white: '#217346',
          },
        })}
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
          link: {
            color: 'white !important',
            height: '7rem',
            paddingLeft: '2rem',
            '&:focus': { outlineColor: 'white' },
          },
        }}
      />
    )
  }
}

export default Menu
