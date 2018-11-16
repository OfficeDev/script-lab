import React from 'react';

import { Customizer } from 'office-ui-fabric-react/lib/Utilities';
import { CommandBar, ICommandBarItemProps } from 'office-ui-fabric-react/lib/CommandBar';

import { getCommandBarFabricTheme } from '../../../theme';

const theme = getCommandBarFabricTheme('EXCEL');

interface IProps {
  solutionName: string;
  host: string;
  refresh: () => void;
  goBack?: () => void;
}

const Header = ({ solutionName, host, refresh, goBack }: IProps) => {
  const items = [
    {
      hidden: !goBack,
      item: {
        key: 'go-back',
        iconProps: { iconName: 'Back' },
        onClick: goBack,
      },
    },
    {
      item: {
        key: 'title',
        iconProps: { iconName: 'Refresh' },
        text: solutionName,
        onClick: refresh,
      },
    },
  ]
    .filter(({ hidden }) => !hidden)
    .map(({ item }) => item);

  return (
    <Customizer settings={{ theme: getCommandBarFabricTheme(host) }}>
      <CommandBar items={items} styles={{ root: { paddingLeft: 0, paddingRight: 0 } }} />
    </Customizer>
  );
};

export default Header;
