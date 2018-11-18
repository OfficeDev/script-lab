import React from 'react';
import { storiesOf } from '@storybook/react';

import Header, { IProps } from './index';
import { ICommandBarItemProps } from 'office-ui-fabric-react/lib/CommandBar';
import { PersonaCoin, PersonaSize } from 'office-ui-fabric-react/lib/PersonaCoin';

const items: ICommandBarItemProps[] = [
  { key: 'hamburger', iconOnly: true, iconProps: { iconName: 'GlobalNavButton' } },
  { key: 'title', text: 'Title' },
  { key: 'button1', text: 'Foo', iconProps: { iconName: 'Play' } },
  { key: 'button2', text: 'Bar', iconProps: { iconName: 'Delete' } },
];

const farItems: ICommandBarItemProps[] = [
  {
    key: 'sign-in',
    iconOnly: true,
    onRenderIcon: () => (
      <PersonaCoin
        size={PersonaSize.size28}
        initialsColor="white"
        styles={{
          initials: {
            color: 'green',
          },
        }}
      />
    ),
  },
];

const props: IProps = {
  items,
  farItems,
};

storiesOf('Header', module).add('basic', () => <Header {...props} />);
