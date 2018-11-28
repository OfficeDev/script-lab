import React from 'react';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import CommonHeader from 'common/lib/components/Header';

export interface IProps {
  solutionName?: string;

  goBack?: () => void;
  refresh: () => void;
  hardRefresh: () => void;
  openCode: () => void;
}

const Header = ({ solutionName, goBack, refresh, hardRefresh, openCode }: IProps) => {
  const items = [
    {
      hidden: !goBack,
      key: 'go-back',
      iconProps: { iconName: 'Back' },
      onClick: goBack,
    },
    {
      key: 'title',
      text: solutionName || '',
      onRenderIcon: (props, defaultRender) => {
        return solutionName ? null : (
          <Spinner size={SpinnerSize.small} style={{ padding: '.1rem' }} />
        );
      },
      style: { padding: '0 2rem' },
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
          {
            key: 'pop-out',
            iconProps: { iconName: 'OpenInNewWindow' },
            text: 'Open Code Editor',
            onClick: openCode,
          },
        ],
      },
    },
  ];

  return <CommonHeader items={items} farItems={farItems} />;
};

export default Header;
