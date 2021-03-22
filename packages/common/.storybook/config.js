import { configure, addDecorator } from '@storybook/react';

import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from "@storybook/addon-knobs";

import '../src/index.css';

import { getTheme, setupFabricTheme } from '../src/theme';
import { initializeIcons } from 'office-ui-fabric-react/lib-commonjs/Icons';
import React from 'react';
import { ThemeProvider } from 'styled-components';

setupFabricTheme('EXCEL');
initializeIcons();

addDecorator(storyFn => (
  <ThemeProvider theme={getTheme("EXCEL")}>{storyFn()}</ThemeProvider>
));


addDecorator(withKnobs);
addDecorator(withA11y);

// automatically import all files ending in *.stories.js
const req = require.context('../src/components', true, /.stories.tsx$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

// add ms-fabric to the preview's body
if (global.document !== undefined) {
  global.document.getElementsByTagName('body')[0].classList.add('ms-Fabric');
}

configure(loadStories, module);
