import React from 'react';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import CommonHeader from 'common/lib/components/Header';
import { Utilities, HostType, PlatformType } from '@microsoft/office-js-helpers';

export interface IProps {
  solution?: ISolution | null;

  goBack?: () => void;
  refresh: () => void;
  hardRefresh: () => void;
  openCode: () => void;
}

const Header = ({ solution, goBack, refresh, hardRefresh, openCode }: IProps) => {
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
          shouldShowPopoutControls()
            ? {
                key: 'pop-out',
                iconProps: { iconName: 'OpenInNewWindow' },
                text: 'Open Code Editor',
                onClick: openCode,
              }
            : null,
        ].filter(item => item !== null),
      },
    },
  ];

  return <CommonHeader items={items} farItems={farItems} />;
};

export default Header;

///////////////////////////////////////

function shouldShowPopoutControls() {
  // IMPORTANT: IF YOU MAKE ANY CHANGES HERE, UPDATE THE EDITOR'S
  // "shouldShowPopoutControls" logic to be similar!

  // For an explanation of why we're only enabling the particular platforms/hosts
  //     see the Editor's version of this function.

  // Also note that on the Mac, popping out the editor doesn't work
  // if you've navigated to the runner from the Editor domain -- likely
  // because some Office.js context gets lost (?).  In either case,
  // we're ok with doing it only for Office Online for now.

  return (
    Utilities.host === HostType.OUTLOOK ||
    Utilities.platform === PlatformType.OFFICE_ONLINE
  );
}
