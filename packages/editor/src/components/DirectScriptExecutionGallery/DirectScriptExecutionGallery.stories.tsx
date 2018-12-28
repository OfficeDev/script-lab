import React from 'react';

import { DirectScriptExecutionGallery } from './';

import { storiesOf } from '@storybook/react';

storiesOf('Default Run Gallery', module).add('basic', () => (
  <DirectScriptExecutionGallery />
));
