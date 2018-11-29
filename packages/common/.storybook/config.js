import { configure, addDecorator } from '@storybook/react';
import { configureActions } from '@storybook/addon-actions';
import { checkA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';

import { ThemeProvider } from 'styled-components';
import React from 'react';

import '../src/index.css';
import { getTheme, setupFabricTheme } from '../src/theme';
import { initializeIcons } from 'office-ui-fabric-react/lib-commonjs/Icons';
import { setOptions } from '@storybook/addon-options';

setOptions({
  hierarchySeparator: /\//,
  hierarchyRootSeparator: /\|/,
});
configureActions({
  depth: 100,
  limit: 20,
});

setupFabricTheme('EXCEL');
initializeIcons();

const scThemeProvider = storyFn => (
  <ThemeProvider theme={getTheme('EXCEL')}>{storyFn()}</ThemeProvider>
);

addDecorator(scThemeProvider);
addDecorator(withKnobs);
addDecorator(checkA11y);

// automatically import all files ending in *.stories.js
const req = require.context('../src/components', true, /.stories.tsx$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

if (global.document !== undefined) {
  global.document.getElementsByTagName('body')[0].classList.add('ms-Fabric');
}

configure(loadStories, module);
