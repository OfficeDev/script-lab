import React from 'react';

import CommonHeader from 'common/lib/components/Header';

export interface IProps {
  solutionName: string;

  goBack?: () => void;
  refresh: () => void;
}

const Header = ({ solutionName, goBack, refresh }: IProps) => {
  const items = [
    {
      hidden: !goBack,
      item: { key: 'go-back', iconProps: { iconName: 'Back' }, onClick: goBack },
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

  return <CommonHeader items={items} />;
};

export default Header;
