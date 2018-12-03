import React from 'react';
import { storiesOf } from '@storybook/react';

import Footer, { IProps } from './index';
import { ICommandBarItemProps } from 'office-ui-fabric-react/lib/CommandBar';

const items: ICommandBarItemProps[] = [
  { key: 'hamburger', iconOnly: true, iconProps: { iconName: 'GlobalNavButton' } },
  { key: 'title', text: 'Title' },
  { key: 'button1', text: 'Foo', iconProps: { iconName: 'Play' } },
  { key: 'button2', text: 'Bar', iconProps: { iconName: 'Delete' } },
];

const props: IProps = {
  items,
};

storiesOf('Footer', module).add('basic', () => <Footer {...props} />);
