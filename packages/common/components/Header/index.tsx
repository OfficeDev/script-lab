import React from 'react';

import { Customizer } from 'office-ui-fabric-react/lib/Utilities';
import { CommandBar, ICommandBarProps } from 'office-ui-fabric-react/lib/CommandBar';

import { getCommandBarFabricTheme } from '../../theme';
import { getPlatform, PlatformType } from '../../platform';

export interface IProps extends ICommandBarProps {
  host: string;
}

const Header = props => (
  <Customizer settings={{ theme: getCommandBarFabricTheme(props.host) }}>
    <CommandBar
      {...props}
      styles={{
        ...(props.styles || {}),
        root: {
          ...(props.styles ? props.styles.root || {} : {}),
          paddingLeft: 0,
          paddingRight: {
            [PlatformType.PC]: '20px',
            [PlatformType.Mac]: '40px',
            [PlatformType.OfficeOnline]: '0px',
          }[getPlatform()],
        },
      }}
    />
  </Customizer>
);

export default Header;
