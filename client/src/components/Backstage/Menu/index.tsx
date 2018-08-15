import React from 'react'
import { Nav } from 'office-ui-fabric-react/lib/Nav'
import {
  createTheme,
  getFocusStyle,
  mergeStyles,
} from 'office-ui-fabric-react/lib/Styling'
import theme, { backstageMenuTheme } from '../../../theme'

// TODO: make it so that I don't cry when I look at this styling..
export class Menu extends React.Component<any, any> {
  render(): JSX.Element {
    return (
      <Nav
        theme={backstageMenuTheme}
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
          root: { width: '22rem', height: '100vh', background: theme.accent },
          link: mergeStyles(
            getFocusStyle(
              backstageMenuTheme,
              undefined,
              undefined,
              undefined,
              'white',
              undefined,
            ),
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
