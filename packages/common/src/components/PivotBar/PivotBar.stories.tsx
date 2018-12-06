import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import PivotBar, { IPivotBarItem } from './index';

const numItems = 5;
const numbers = Array.from(Array(numItems).keys());

const items: IPivotBarItem[] = numbers.map(n => ({
  key: `item-${n}`,
  text: `Item ${n}`,
}));

const props = {
  items,
  onSelect: action('onSelect'),
  selectedKey: 'item-1',
};

storiesOf('Pivot Bar', module).add('basic', () => <PivotBar {...props} />);
