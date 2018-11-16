import React from 'react';

import merge from 'lodash/merge';

import { Customizer } from 'office-ui-fabric-react/lib/Utilities';
import { CommandBar, ICommandBarProps } from 'office-ui-fabric-react/lib/CommandBar';

import { getCommandBarFabricTheme } from '../../theme';
import { getPlatform, PlatformType } from '../../platform';

export interface IProps extends ICommandBarProps {
  host: string;
}

const Header = (props: IProps) => (
  <Customizer settings={{ theme: getCommandBarFabricTheme(props.host) }}>
    <CommandBar
      {...merge(props, {
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

export default Header;
