import React from 'react';
import { storiesOf } from '@storybook/react';

import Footer, { IProps } from './index';
import { ICommandBarItemProps } from 'office-ui-fabric-react/lib/CommandBar';
import { PersonaCoin, PersonaSize } from 'office-ui-fabric-react/lib/PersonaCoin';

const items: ICommandBarItemProps[] = [
  { key: 'hamburger', iconOnly: true, iconProps: { iconName: 'GlobalNavButton' } },
  { key: 'title', text: 'Title' },
  { key: 'button1', text: 'Foo', iconProps: { iconName: 'Play' } },
  { key: 'button2', text: 'Bar', iconProps: { iconName: 'Delete' } },
];

const props = {
  host: 'EXCEL',
  items,
};

storiesOf('Footer', module).add('basic', () => <Footer {...props} />);
