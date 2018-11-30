import 'common/lib/polyfills';
import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './components/App';

Office.onReady().then(() => {
  ReactDOM.render(<App />, document.getElementById('root') as HTMLElement);
});
