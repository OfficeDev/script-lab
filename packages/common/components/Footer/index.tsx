import React from 'react';
import { withTheme } from 'styled-components';

import merge from 'lodash/merge';

import { Customizer } from 'office-ui-fabric-react/lib/Utilities';
import { CommandBar, ICommandBarProps } from 'office-ui-fabric-react/lib/CommandBar';

import { getCommandBarFabricTheme } from '../../theme';
import { Wrapper } from './styles';

export interface IProps extends ICommandBarProps {}

interface IPrivateProps extends IProps {
  theme: ITheme | any; // withTheme
}

const Footer = (props: IPrivateProps) => {
  const items = props.items
    .filter(({ hidden }) => !hidden)
    .map(item => {
      console.log(item);
      return merge(item, {
        ...(item.subMenuProps
          ? {
              subMenuProps: {
                isBeakVisible: true,
                shouldFocusOnMount: true,
                styles: {
                  root: {
                    backgroundColor: props.theme.primary,
                    color: props.theme.white,
                  },
                },
                items:
                  item.subMenuProps !== undefined && item.subMenuProps.items
                    ? item.subMenuProps.items.map(subItem =>
                        merge(subItem, {
                          itemProps: {
                            styles: {
                              root: {
                                background: props.theme.primary,
                                selectors: {
                                  ':hover': {
                                    background: props.theme.primaryDark,
                                  },
                                  ':active': {
                                    background: props.theme.primaryDarker,
                                  },
                                },
                              },
                              label: {
                                color: props.theme.white,
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
      });
    });

  const { theme, ...propsNoTheme } = props;
  const mergedProps = merge(
    { ...propsNoTheme, items },
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

export default withTheme(Footer);