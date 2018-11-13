import React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean } from '@storybook/addon-knobs';

import { Welcome } from './';

storiesOf('Custom Functions|Welcome', module).add('basic', () => (
  <Welcome isRefreshEnabled={boolean('isRefreshEnabled', false)} />
));
