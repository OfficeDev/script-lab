import './polyfills';
import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './components/App';

Office.onReady(async () => {
  ReactDOM.render(<App />, document.getElementById('root') as HTMLElement);
});
