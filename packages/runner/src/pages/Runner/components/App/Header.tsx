import React from 'react';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import CommonHeader from 'common/lib/components/Header';

export interface IProps {
  solution?: ISolution | null;

  goBack?: () => void;
  refresh: () => void;
  hardRefresh: () => void;
}

const Header = ({ solution, goBack, refresh, hardRefresh }: IProps) => {
  const items = [
    {
      hidden: !goBack,
      key: 'go-back',
      iconProps: { iconName: 'Back' },
      onClick: goBack,
    },
    {
      key: 'title',
      text: solution ? solution.name : '',
      onRenderIcon: (props, defaultRender) => {
        return solution === undefined ? (
          <Spinner size={SpinnerSize.small} style={{ padding: '.1rem' }} />
        ) : (
          <Icon iconName="Refresh" style={{ padding: '.4rem' }} />
        );
      },
      style: { padding: '0 1rem' },
      onClick: refresh,
    },
  ];

  const farItems = [
    {
      key: 'overflow',
      iconProps: { iconName: 'More' },
      subMenuProps: {
        items: [
          {
            key: 'hard-refresh',
            iconProps: { iconName: 'Refresh' },
            text: 'Hard Refresh',
            onClick: hardRefresh,
          },
        ],
      },
    },
  ];

  return <CommonHeader items={items} farItems={farItems} />;
};

export default Header;
