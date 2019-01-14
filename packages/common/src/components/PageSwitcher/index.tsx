import React from 'react';

import { HashRouter, Route, Switch } from 'react-router-dom';

interface IProps {
  pages: { [key: string]: React.ComponentType<any> };
  paths: { [key: string]: string };
  defaultComponent: React.ComponentType<any>;
}

const PageSwitcher = ({ pages, paths, defaultComponent }: IProps) => (
  <HashRouter>
    <Switch>
      {/* Render a route for each page */}
      {Object.keys(pages).map(page => (
        <Route exact path={paths[page]} component={pages[page]} key={page} />
      ))}
      {/* Falling back on the default component for an unknown route */}
      <Route component={defaultComponent} />
    </Switch>
  </HashRouter>
);

export default PageSwitcher;
