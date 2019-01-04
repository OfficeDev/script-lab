import React from 'react';
import { withTheme } from 'styled-components';

import merge from 'lodash/merge';
import omit from 'lodash/omit';

import { Customizer } from 'office-ui-fabric-react/lib/Utilities';
import { CommandBar, ICommandBarProps } from 'office-ui-fabric-react/lib/CommandBar';

import { getCommandBarFabricTheme } from '../../theme';
import { getPlatform, PlatformType } from '../../platform';

export interface IProps extends ICommandBarProps {}

interface IPrivateProps extends IProps {
  theme: ITheme | any; // from withTheme
}

const Header = (props: IPrivateProps) => {
  const items = props.items
    .filter(({ hidden }) => !hidden)
    .map(item => ({ ...item, 'data-testid': item.key }));
  const farItems = props.farItems ? props.farItems.filter(({ hidden }) => !hidden) : [];

  return (
    <Customizer settings={{ theme: getCommandBarFabricTheme(props.theme) }}>
      <CommandBar
        {...merge(omit({ ...props, items, farItems }, ['theme']), {
          styles: {
            root: {
              paddingLeft: 0,
              paddingRight: {
                [PlatformType.PC]: '20px',
                [PlatformType.Mac]: '40px',
                [PlatformType.OfficeOnline]: '0px',
              }[getPlatform()],
            },
          },
        })}
      />
    </Customizer>
  );
};

export default withTheme(Header);
