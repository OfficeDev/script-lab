import React from 'react'
import { Nav, INavStyleProps, INavStyles } from 'office-ui-fabric-react/lib/Nav'
import {
  getFocusStyle,
  mergeStyles,
  ITheme as IFabricTheme,
} from 'office-ui-fabric-react/lib/Styling'

// TODO: make it so that I don't cry when I look at this styling..
export interface IMenu {
  theme: ITheme
  items: any[]
  selectedKey: string
}

export class Menu extends React.Component<IMenu> {
  getNavStyles = (props: INavStyleProps): Partial<INavStyles> => {
    const { theme } = this.props
    const { isSelected } = props

    return {
      root: { width: '22rem', height: '100vh', background: theme.primary },
      link: mergeStyles(
        getFocusStyle(
          props.theme,
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
        isSelected && {
          selectors: {
            '&:after': {
              borderLeft: `2px solid ${theme.white}`,
              content: '""',
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
            },
          },
        },
      ),
    }
  }

  render(): JSX.Element {
    const { theme, items, selectedKey } = this.props
    return (
      <Nav
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
        styles={this.getNavStyles}
      />
    )
  }
}

export default Menu
