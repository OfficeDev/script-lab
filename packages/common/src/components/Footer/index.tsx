import React from 'react';
import { withTheme } from 'styled-components';

import merge from 'lodash/merge';

import { Customizer } from 'office-ui-fabric-react/lib/Utilities';
import {
  CommandBar,
  ICommandBarProps,
  ICommandBarItemProps,
} from 'office-ui-fabric-react/lib/CommandBar';

import { getCommandBarFabricTheme } from '../../theme';
import { Wrapper } from './styles';

export type IProps = ICommandBarProps;

interface IPrivateProps extends IProps {
  theme: ITheme | any; // withTheme
}

const Footer = (props: IPrivateProps) => {
  const items = normalizeItems(props.items, props.theme);
  const farItems = props.farItems ? normalizeItems(props.farItems, props.theme) : [];

  const { theme, ...propsNoTheme } = props;
  const mergedProps = merge(
    { ...propsNoTheme, items, farItems },
    {
      styles: {
        root: {
          paddingLeft: 0,
          paddingRight: 0,
          height: '2rem',
        },
      },
    },
  );

  return (
    <Customizer settings={{ theme: getCommandBarFabricTheme(props.theme) }}>
      <Wrapper>
        <CommandBar {...mergedProps} />
      </Wrapper>
    </Customizer>
  );
};

function normalizeItems(
  items: ICommandBarItemProps[],
  theme: ITheme,
): ICommandBarItemProps[] {
  return items
    .filter(({ hidden }) => !hidden)
    .map(item =>
      merge(item, {
        ...(item.subMenuProps
          ? {
              subMenuProps: {
                isBeakVisible: true,
                shouldFocusOnMount: true,
                styles: {
                  root: {
                    backgroundColor: theme.primary,
                    color: theme.white,
                  },
                },
                items:
                  item.subMenuProps !== undefined && item.subMenuProps.items
                    ? item.subMenuProps.items.map(subItem =>
                        merge(subItem, {
                          itemProps: {
                            styles: {
                              root: {
                                background: theme.primary,
                                selectors: {
                                  ':hover': {
                                    background: theme.primaryDark,
                                  },
                                  ':active': {
                                    background: theme.primaryDarker,
                                  },
                                },
                              },
                              label: {
                                color: theme.white,
                              },
                            },
                          },
                        }),
                      )
                    : [],
              },
            }
          : {}),

        style: { fontSize: '1.2rem' },
        iconProps: item.iconProps
          ? {
              style: {
                fontSize: '1.4rem',
                ...(item.iconProps.style ? item.iconProps.style : {}),
              },
              ...item.iconProps,
            }
          : undefined,
      }),
    );
}

export default withTheme(Footer);
