import React from 'react';
import { storiesOf } from '@storybook/react';

import LoadingIndicator from './index';

storiesOf('Misc|Loading Indicator', module).add('basic', () => (
  <div style={{ height: '400px', width: '300px', background: 'lightgray' }}>
    <LoadingIndicator ballSize={32} numBalls={5} ballColor="rebeccapurple" delay={0.05} />
  </div>
));
